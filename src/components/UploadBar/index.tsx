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
    <div
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '13px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {showWarnIcon && (
          <span style={{ color: '#f59e0b', display: 'flex' }}>
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
          <span style={{ color: '#22c55e', display: 'flex' }}>
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
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
          {result
            ? result.status === 'PASS'
              ? 'All checks passed'
              : `${failedCount} issue${failedCount !== 1 ? 's' : ''} found`
            : summaryText}
        </span>
        {result && result.status !== 'PASS' && (
          <span style={{ fontSize: 13, color: '#475569' }}>
            — review before uploading
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onOverride}
          disabled={!result}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'transparent',
            color: '#f59e0b',
            border: '1.5px solid #f59e0b',
            fontSize: 13,
            fontWeight: 600,
            cursor: result ? 'pointer' : 'not-allowed',
            fontFamily: 'Inter, sans-serif',
            opacity: result ? 1 : 0.45,
            transition: 'background 0.15s',
          }}
        >
          Override &amp; Upload
        </button>

        <button
          onClick={canUpload && result ? onUpload : undefined}
          disabled={!canUpload || !result}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: canUpload && result ? '#22c55e' : '#e2e8f0',
            color: canUpload && result ? '#ffffff' : '#94a3b8',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: canUpload && result ? 'pointer' : 'not-allowed',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.15s',
          }}
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
