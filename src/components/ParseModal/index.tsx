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

  const inputClasses = [
    'w-full p-[10px_12px] rounded-lg text-[13px] text-slate-950 outline-none',
    'border-[1.5px] transition-[border-color,background] duration-150',
    showError
      ? 'border-red-200 bg-red-50'
      : valid && touched
        ? 'border-green-200 bg-slate-50'
        : 'border-slate-200 bg-slate-50',
  ].join(' ')

  return (
    <div
      className="fixed inset-0 bg-[rgba(15,23,42,0.55)] backdrop-blur-[3px] z-[60] flex items-center justify-center p-[20px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="fade-in bg-white rounded-2xl w-full max-w-[520px] shadow-[0_24px_64px_rgba(0,0,0,0.22)] overflow-hidden">
        <div className="p-[20px_22px_18px] border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-[9px] mb-1">
              <div className="w-[30px] h-[30px] rounded-[7px] bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
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
              <span className="text-[15px] font-bold text-slate-900">
                Parse Google Document
              </span>
            </div>
            <p className="text-[12px] text-slate-400 m-0 pl-[39px]">
              Paste a Google Docs URL or bare document ID
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-slate-400 p-[6px] rounded-md flex items-center shrink-0"
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

        <div className="p-[20px_22px]">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em] block mb-[6px]">
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
            className={inputClasses}
          />

          {showError && (
            <p className="text-[11.5px] text-red-600 mt-[5px]">
              Doesn&apos;t look like a valid Google Docs URL or document ID.
            </p>
          )}

          <div className="mt-[12px] p-[10px_12px] bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-[8px]">
            <svg
              width="13"
              height="13"
              className="shrink-0 mt-px"
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
            <span className="text-[12px] text-slate-500 leading-[1.5]">
              The document must be shared as{' '}
              <strong className="text-slate-600">
                &quot;Anyone with the link can view&quot;
              </strong>
              . No API key required.
            </span>
          </div>

          <div className="mt-[10px] flex items-center gap-[7px]">
            <span className="text-[11.5px] text-slate-400">
              Try the example doc:
            </span>
            <button
              onClick={() => {
                setUrl(EXAMPLE_URL)
                setTouched(false)
              }}
              className="bg-transparent border-0 p-0 text-[11.5px] text-blue-500 cursor-pointer underline"
            >
              Best Leather Dog Collars
            </button>
          </div>
        </div>

        <div className="p-[14px_22px] border-t border-slate-200 flex justify-end gap-[8px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[8px] rounded-lg bg-transparent text-slate-600 text-[13px] font-semibold cursor-pointer border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valid || isLoading}
            className={`px-[20px] py-[8px] rounded-lg border-0 text-[13px] font-semibold flex items-center gap-[7px] transition-colors ${
              valid && !isLoading
                ? 'bg-slate-900 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
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
