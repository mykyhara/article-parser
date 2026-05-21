'use client'
import { useState } from 'react'

const EXAMPLE_URL =
  'https://docs.google.com/document/d/1s0fZsDcXJtiwrqUT1fVInS6q1yCZwVKkyCEGcxUiIYY/edit'

type ParseModalProps = {
  open: boolean
  isLoading: boolean
  onParse: (url: string) => void
  onClose: () => void
}

function isValidGoogleDocUrl(value: string): boolean {
  if (!value.trim()) return false
  if (/^[\w-]{25,}$/.test(value.trim())) return true
  return /docs\.google\.com\/document\/d\/[\w-]+/.test(value)
}

export function ParseModal({
  open,
  isLoading,
  onParse,
  onClose,
}: ParseModalProps) {
  const [url, setUrl] = useState(EXAMPLE_URL)
  const [touched, setTouched] = useState(false)

  const valid = isValidGoogleDocUrl(url)
  const showError = touched && !valid && url.trim().length > 0

  function handleSubmit() {
    if (!valid || isLoading) return
    onParse(url.trim())
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="fade-in"
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 22px 18px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                Parse Google Document
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: '#94a3b8',
                margin: 0,
                paddingLeft: 39,
              }}
            >
              Paste a Google Docs URL or bare document ID
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
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

        <div style={{ padding: '20px 22px' }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Document URL
          </label>
          <input
            type="text"
            value={url}
            autoFocus
            onChange={(e) => {
              setUrl(e.target.value)
              setTouched(true)
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://docs.google.com/document/d/..."
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1.5px solid ${showError ? '#fecaca' : valid && touched ? '#bbf7d0' : '#e2e8f0'}`,
              borderRadius: 8,
              fontSize: 13,
              color: '#0f172a',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              background: showError ? '#fef2f2' : '#f8fafc',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          />

          {showError && (
            <p style={{ fontSize: 11.5, color: '#dc2626', marginTop: 5 }}>
              Doesn&apos;t look like a valid Google Docs URL or document ID.
            </p>
          )}

          <div
            style={{
              marginTop: 12,
              padding: '10px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <svg
              width="13"
              height="13"
              style={{ flexShrink: 0, marginTop: 1 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              The document must be shared as{' '}
              <strong style={{ color: '#475569' }}>
                &quot;Anyone with the link can view&quot;
              </strong>
              . No API key required.
            </span>
          </div>

          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
              Try the example doc:
            </span>
            <button
              onClick={() => {
                setUrl(EXAMPLE_URL)
                setTouched(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 11.5,
                color: '#3b82f6',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'underline',
              }}
            >
              Best Leather Dog Collars
            </button>
          </div>
        </div>

        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
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
            onClick={handleSubmit}
            disabled={!valid || isLoading}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: valid && !isLoading ? '#0f172a' : '#e2e8f0',
              color: valid && !isLoading ? '#ffffff' : '#94a3b8',
              fontSize: 13,
              fontWeight: 600,
              cursor: valid && !isLoading ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'background 0.15s',
            }}
          >
            {isLoading ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Parsing…
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Parse Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
