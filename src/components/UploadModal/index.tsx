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

const roInputCls =
  'text-[13px] text-slate-900 border border-slate-200 rounded-[8px] p-[8px_12px] bg-slate-50 outline-none w-full'

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
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.5)] backdrop-blur-[3px] z-[60] flex items-center justify-center p-[20px]">
      <div className="fade-in bg-white rounded-[16px] w-full max-w-[640px] max-h-[90vh] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.22)]">
        <div className="p-[18px_22px] border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[15px] font-bold text-slate-900">
            {phase === 'success'
              ? 'Upload Complete'
              : 'Review WordPress Payload'}
          </div>
          <button
            onClick={handleClose}
            className="bg-transparent border-none cursor-pointer text-slate-400 p-[6px] rounded-[6px] flex items-center"
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

        <div className="flex-1 overflow-y-auto p-[22px]">
          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-[14px] py-[32px]">
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
              <span className="text-[14px] font-medium text-slate-600">
                Sending to WordPress…
              </span>
            </div>
          )}

          {phase === 'success' && response && (
            <div className="fade-in flex flex-col items-center gap-[16px] pt-[8px]">
              <span className="text-green-500 success-icon">
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
              <div className="text-center">
                <div className="text-[16px] font-bold text-slate-900 mb-[4px]">
                  Successfully sent to WordPress
                </div>
                <div className="text-[13px] text-slate-400">
                  The article has been created as a draft post and is ready for
                  review.
                </div>
              </div>
              <div className="w-full bg-slate-900 rounded-[10px] p-[14px_16px]">
                <pre className="m-0 text-[12px] text-slate-400 font-mono leading-[1.65] whitespace-pre-wrap">
                  {MOCK_RESPONSE_TEMPLATE(response)}
                </pre>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="p-[12px_14px] bg-red-50 border border-red-200 rounded-[8px] text-red-800 text-[13px]">
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
                <div key={f.label} className="mb-[14px]">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-[5px] uppercase tracking-[0.06em]">
                    {f.label}
                  </label>
                  {f.multi ? (
                    <textarea
                      readOnly
                      value={f.val}
                      rows={3}
                      className={`${roInputCls} resize-none`}
                    />
                  ) : (
                    <input
                      readOnly
                      type="text"
                      value={f.val}
                      className={roInputCls}
                    />
                  )}
                </div>
              ))}
              <div>
                <div className="flex items-center justify-between mb-[5px]">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">
                    Article HTML
                  </label>
                  <button
                    onClick={handleCopyHtml}
                    className="flex items-center gap-[4px] bg-slate-800 text-slate-400 border border-slate-700 rounded-[6px] px-[9px] py-[4px] text-[11px] font-medium cursor-pointer"
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
                <pre className="bg-slate-900 text-slate-200 p-[14px] rounded-[8px] text-[11.5px] leading-[1.6] max-h-[200px] overflow-y-auto m-0 font-mono whitespace-pre-wrap">
                  {payload.articleHtml}
                </pre>
              </div>
            </>
          )}
        </div>

        <div className="p-[14px_22px] border-t border-slate-200 flex justify-end gap-[8px] shrink-0">
          {phase === 'success' ? (
            <button
              onClick={() => {
                handleClose()
                onUploadSuccess?.()
              }}
              className="px-[20px] py-[8px] rounded-[8px] bg-slate-900 text-white text-[13px] font-semibold cursor-pointer border-none"
            >
              Done
            </button>
          ) : phase === 'loading' ? null : (
            <>
              <button
                onClick={handleClose}
                className="px-[16px] py-[8px] rounded-[8px] bg-transparent text-slate-600 text-[13px] font-semibold cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-[20px] py-[8px] rounded-[8px] bg-green-500 text-white text-[13px] font-semibold cursor-pointer border-none"
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
