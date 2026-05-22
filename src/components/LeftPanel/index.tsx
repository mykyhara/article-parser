'use client'
import { QualityScoreCard } from '@/components/QualityScoreCard'
import { QualityChecksAccordion } from '@/components/QualityChecksAccordion'
import type { ParsedArticle, QualityCheckResult, ApiError } from '@/types'

type LeftPanelProps = {
  article: ParsedArticle | null
  qualityResult: QualityCheckResult | null
  isLoading: boolean
  error: ApiError | null
  onOpenParse: () => void
}

const CHECK_ITEMS = [
  {
    label: 'Images',
    desc: 'Count, Drive hosting & public access',
    svg: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    label: 'Product links',
    desc: 'Count within allowed range',
    svg: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    label: 'Alt tags',
    desc: 'Present and minimum length',
    svg: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 6.1H3" />
        <path d="M21 12.1H3" />
        <path d="M15.1 18H3" />
      </svg>
    ),
  },
  {
    label: 'Formatting',
    desc: 'H1 / H2 structure',
    svg: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
]

export function LeftPanel({
  article,
  qualityResult,
  isLoading,
  error,
  onOpenParse,
}: LeftPanelProps) {
  return (
    <aside
      style={{
        width: '36%',
        minWidth: 300,
        maxWidth: 420,
        overflowY: 'auto',
        padding: '18px 14px 18px 20px',
        borderRight: '1px solid #e2e8f0',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {(isLoading || qualityResult) && (
        <QualityScoreCard result={qualityResult} />
      )}

      {error && (
        <div
          style={{
            padding: '14px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 10,
            fontSize: 13,
            color: '#991b1b',
            marginBottom: 10,
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            Failed to parse document
          </p>
          <p
            style={{
              color: '#7f1d1d',
              fontSize: 12,
              lineHeight: 1.5,
              marginBottom: 8,
            }}
          >
            {error.message}
          </p>
          <button
            onClick={onOpenParse}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: '#dc2626',
              textDecoration: 'underline',
              fontFamily: 'Inter, sans-serif',
              padding: 0,
            }}
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{ height: 44, borderRadius: 10, background: '#e2e8f0' }}
            />
          ))}
        </div>
      )}

      {!article && !isLoading && !error && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: '24px 8px',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#f1f5f9',
              border: '1.5px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#475569',
                margin: '0 0 6px',
              }}
            >
              Quality checks
            </p>
            <p
              style={{
                fontSize: 12,
                color: '#94a3b8',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Parse a Google Doc to run
              <br />
              the following checks:
            </p>
          </div>

          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {CHECK_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 9,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'flex',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {item.svg}
                </span>
                <div>
                  <div
                    style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {article && qualityResult && (
        <QualityChecksAccordion article={article} result={qualityResult} />
      )}
    </aside>
  )
}
