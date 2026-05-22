'use client'

import { useState } from 'react'
import type { UploadPayload, UploadResponse } from '@/types'

type Phase = 'review' | 'loading' | 'success' | 'error'

type UploadModalProps = {
  open: boolean
  payload: UploadPayload | null
  onClose: () => void
  onUploadSuccess?: () => void
}

const MOCK_RESPONSE_TEMPLATE = (res: UploadResponse) =>
  JSON.stringify(
    {
      post_id: res.wordpressPostId,
      status: 'draft',
      permalink: res.postUrl,
      date_gmt: res.publishedAt,
      message: res.message,
    },
    null,
    2
  )

const roInput: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  color: '#0f172a',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '8px 12px',
  background: '#f8fafc',
  outline: 'none',
  width: '100%',
}

export function UploadModal({
  open,
  payload,
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const [phase, setPhase] = useState<Phase>('review')
  const [response, setResponse] = useState<UploadResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleConfirm() {
    if (!payload) return
    setPhase('loading')
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as UploadResponse | { message: string }
      if (!res.ok) {
        setErrorMsg((data as { message: string }).message ?? 'Upload failed')
        setPhase('error')
      } else {
        setResponse(data as UploadResponse)
        setPhase('success')
      }
    } catch {
      setErrorMsg('Network error — could not reach the server')
      setPhase('error')
    }
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setPhase('review')
      setResponse(null)
      setErrorMsg('')
      setCopied(false)
    }, 350)
  }

  async function handleCopyHtml() {
    if (!payload) return
    try {
      await navigator.clipboard.writeText(payload.articleHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* denied */
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="fade-in"
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        }}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
            {phase === 'success'
              ? 'Upload Complete'
              : 'Review WordPress Payload'}
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px' }}>
          {phase === 'loading' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                padding: '32px 0',
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#475569' }}>
                Sending to WordPress…
              </span>
            </div>
          )}

          {phase === 'success' && response && (
            <div
              className="fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                paddingTop: 8,
              }}
            >
              <span style={{ color: '#22c55e' }} className="success-icon">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: 4,
                  }}
                >
                  Successfully sent to WordPress
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                  The article has been created as a draft post and is ready for
                  review.
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  background: '#0f172a',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {MOCK_RESPONSE_TEMPLATE(response)}
                </pre>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div
              style={{
                padding: '12px 14px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#991b1b',
                fontSize: 13,
              }}
            >
              {errorMsg}
            </div>
          )}

          {(phase === 'review' || phase === 'error') && payload && (
            <>
              {[
                { label: 'Meta Title', val: payload.metaTitle, multi: false },
                {
                  label: 'Meta Description',
                  val: payload.metaDescription,
                  multi: true,
                },
                {
                  label: 'Article Title',
                  val: payload.articleTitle,
                  multi: false,
                },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94a3b8',
                      display: 'block',
                      marginBottom: 5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {f.label}
                  </label>
                  {f.multi ? (
                    <textarea
                      readOnly
                      value={f.val}
                      rows={3}
                      style={{ ...roInput, resize: 'none' }}
                    />
                  ) : (
                    <input readOnly type="text" value={f.val} style={roInput} />
                  )}
                </div>
              ))}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Article HTML
                  </label>
                  <button
                    onClick={handleCopyHtml}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#1e293b',
                      color: '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: 6,
                      padding: '4px 9px',
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre
                  style={{
                    background: '#0f172a',
                    color: '#e2e8f0',
                    padding: 14,
                    borderRadius: 8,
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    maxHeight: 200,
                    overflowY: 'auto',
                    margin: 0,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {payload.articleHtml}
                </pre>
              </div>
            </>
          )}
        </div>

        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {phase === 'success' ? (
            <button
              onClick={() => {
                handleClose()
                onUploadSuccess?.()
              }}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: '#0f172a',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                border: 'none',
              }}
            >
              Done
            </button>
          ) : phase === 'loading' ? null : (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  border: '1px solid #e2e8f0',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: '#22c55e',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  border: 'none',
                }}
              >
                Confirm Upload
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
