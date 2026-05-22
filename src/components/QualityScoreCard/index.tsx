'use client'
import type { QualityCheckResult, QualityStatus } from '@/types'

type QualityScoreCardProps = {
  result: QualityCheckResult | null
}

const STATUS_CONFIG: Record<
  QualityStatus,
  {
    bg: string
    color: string
    border: string
    label: string
    ringColor: string
  }
> = {
  PASS: {
    bg: '#f0fdf4',
    color: '#15803d',
    border: '#bbf7d0',
    label: 'PASS',
    ringColor: '#22c55e',
  },
  NEEDS_REVIEW: {
    bg: '#fffbeb',
    color: '#92400e',
    border: '#fde68a',
    label: 'NEEDS REVIEW',
    ringColor: '#f59e0b',
  },
  FAIL: {
    bg: '#fef2f2',
    color: '#991b1b',
    border: '#fecaca',
    label: 'FAIL',
    ringColor: '#ef4444',
  },
}

const CHECK_CONFIG: Array<{
  key: keyof QualityCheckResult['checks']
  label: string
}> = [
  { key: 'images', label: 'Images' },
  { key: 'productLinks', label: 'Product Links' },
  { key: 'altTags', label: 'Alt Tags' },
  { key: 'formatting', label: 'Formatting' },
]

function ScoreRing({
  score,
  status,
}: {
  score: number
  status: QualityStatus
}) {
  const SIZE = 124
  const STROKE = 10
  const r = (SIZE - STROKE) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = STATUS_CONFIG[status].ringColor

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: 11,
            color: '#94a3b8',
            fontWeight: 500,
            marginTop: 1,
          }}
        >
          / 100
        </span>
      </div>
    </div>
  )
}

function ChipIcon({ pass, warn }: { pass: boolean; warn: boolean }) {
  if (pass)
    return (
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
    )
  if (warn)
    return (
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
    )
  return (
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckChip({
  label,
  pass,
  warn,
}: {
  label: string
  pass: boolean
  warn: boolean
}) {
  const status = pass ? 'pass' : warn ? 'warn' : 'fail'
  const colors = {
    pass: {
      bg: '#f0fdf4',
      color: '#15803d',
      border: '#bbf7d0',
      icon: '#22c55e',
    },
    warn: {
      bg: '#fffbeb',
      color: '#92400e',
      border: '#fde68a',
      icon: '#f59e0b',
    },
    fail: {
      bg: '#fef2f2',
      color: '#991b1b',
      border: '#fecaca',
      icon: '#ef4444',
    },
  }
  const c = colors[status]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        borderRadius: 8,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span style={{ color: c.icon, display: 'flex', flexShrink: 0 }}>
        <ChipIcon pass={pass} warn={warn} />
      </span>
      {label}
    </div>
  )
}

export function QualityScoreCard({ result }: QualityScoreCardProps) {
  if (!result) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '20px 18px 20px',
          marginBottom: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#94a3b8',
            marginBottom: 16,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Quality Score
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ position: 'relative', width: 124, height: 124 }}>
            <svg
              width={124}
              height={124}
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={62}
                cy={62}
                r={57}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={10}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#cbd5e1',
                  lineHeight: 1,
                }}
              >
                —
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#cbd5e1',
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                / 100
              </span>
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              background: '#f8fafc',
              color: '#94a3b8',
              border: '1px solid #e2e8f0',
            }}
          >
            Awaiting document
          </span>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
        >
          {CHECK_CONFIG.map(({ label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#cbd5e1',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <span
                style={{ display: 'flex', flexShrink: 0, color: '#e2e8f0' }}
              >
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
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[result.status]

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '18px 18px 20px',
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#94a3b8',
          marginBottom: 16,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Quality Score
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <ScoreRing score={result.score} status={result.status} />

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}
        >
          {result.status === 'NEEDS_REVIEW' && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
          {cfg.label}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginTop: 18,
        }}
      >
        {CHECK_CONFIG.map(({ key, label }) => (
          <CheckChip
            key={key}
            label={label}
            pass={result.checks[key].pass}
            warn={false}
          />
        ))}
      </div>
    </div>
  )
}
