'use client'
import type { QualityCheckResult } from '@/types'

type UploadBarProps = {
  result: QualityCheckResult | null
  isLoading: boolean
  hasError: boolean
  onUpload: () => void
  onOverride: () => void
}

export function UploadBar({
  result,
  isLoading,
  hasError,
  onUpload,
  onOverride,
}: UploadBarProps) {
  if (!isLoading && !hasError && !result) return null

  const canUpload = result?.status !== 'FAIL'
  const failedCount = result
    ? Object.values(result.checks).filter((c) => !c.pass).length
    : 0

  const summaryText = isLoading
    ? 'Parsing article…'
    : hasError
      ? 'Parse failed — check error and try again'
      : result?.status === 'PASS'
        ? 'All checks passed — ready to upload'
        : `${failedCount} issue${failedCount !== 1 ? 's' : ''} found — review before uploading`

  const showWarnIcon =
    !isLoading && !hasError && result && result.status !== 'PASS'

  return (
    <div className="bg-white border-t border-slate-200 p-[13px_18px] flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
      <div className="flex items-center gap-[7px]">
        {showWarnIcon && (
          <span className="text-amber-500 flex">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
        )}
        {result?.status === 'PASS' && (
          <span className="text-green-500 flex">
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
        <span className="text-[13px] font-semibold text-slate-900">
          {result
            ? result.status === 'PASS'
              ? 'All checks passed'
              : `${failedCount} issue${failedCount !== 1 ? 's' : ''} found`
            : summaryText}
        </span>
        {result && result.status !== 'PASS' && (
          <span className="text-[13px] text-slate-600">
            — review before uploading
          </span>
        )}
      </div>

      <div className="flex items-center gap-[8px]">
        <button
          onClick={onOverride}
          disabled={!result}
          className={`inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-transparent text-amber-500 border-[1.5px] border-amber-500 text-[13px] font-semibold transition-[background] duration-150 ${result ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`}
        >
          Override &amp; Upload
        </button>

        <button
          onClick={canUpload && result ? onUpload : undefined}
          disabled={!canUpload || !result}
          className={`inline-flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] border-none text-[13px] font-semibold transition-[background] duration-150 ${canUpload && result ? 'bg-green-500 text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload to WordPress
        </button>
      </div>
    </div>
  )
}
