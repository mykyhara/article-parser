'use client'
import type { QualityCheckResult, QualityStatus } from '@/types'

type QualityScoreCardProps = {
  result: QualityCheckResult | null
}

const STATUS_CONFIG: Record<
  QualityStatus,
  {
    bgClass: string
    colorClass: string
    borderClass: string
    label: string
    ringColor: string
  }
> = {
  PASS: {
    bgClass: 'bg-green-50',
    colorClass: 'text-green-700',
    borderClass: 'border-green-200',
    label: 'PASS',
    ringColor: '#22c55e',
  },
  NEEDS_REVIEW: {
    bgClass: 'bg-amber-50',
    colorClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    label: 'NEEDS REVIEW',
    ringColor: '#f59e0b',
  },
  FAIL: {
    bgClass: 'bg-red-50',
    colorClass: 'text-red-800',
    borderClass: 'border-red-200',
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
    <div className="relative w-[124px] h-[124px]">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
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
          className="stroke-dash-transition"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold text-slate-900 leading-none">
          {score}
        </span>
        <span className="text-[11px] text-slate-400 font-medium mt-px">
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
  const classes = {
    pass: {
      chip: 'bg-green-50 border-green-200 text-green-700',
      icon: 'text-green-500',
    },
    warn: {
      chip: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-500',
    },
    fail: {
      chip: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
    },
  }
  const c = classes[status]

  return (
    <div
      className={`flex items-center gap-[6px] p-[7px_12px] rounded-lg border text-[12px] font-medium ${c.chip}`}
    >
      <span className={`${c.icon} flex shrink-0`}>
        <ChipIcon pass={pass} warn={warn} />
      </span>
      {label}
    </div>
  )
}

export function QualityScoreCard({ result }: QualityScoreCardProps) {
  if (!result) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-[20px_18px_20px] mb-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="text-[11px] font-semibold text-slate-400 mb-[16px] tracking-[0.06em] uppercase">
          Quality Score
        </div>

        <div className="flex flex-col items-center gap-[12px] mb-[20px]">
          <div className="relative w-[124px] h-[124px]">
            <svg width={124} height={124} className="-rotate-90">
              <circle
                cx={62}
                cy={62}
                r={57}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={10}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-bold text-slate-300 leading-none">
                —
              </span>
              <span className="text-[11px] text-slate-300 font-medium mt-px">
                / 100
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[7px] text-[12px] font-semibold bg-slate-50 text-slate-400 border border-slate-200">
            Awaiting document
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[8px]">
          {CHECK_CONFIG.map(({ label }) => (
            <div
              key={label}
              className="flex items-center gap-[6px] p-[7px_12px] rounded-lg bg-slate-50 border border-slate-200 text-slate-300 text-[12px] font-medium"
            >
              <span className="flex shrink-0 text-slate-200">
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
    <div className="bg-white border border-slate-200 rounded-xl p-[18px_18px_20px] mb-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="text-[11px] font-semibold text-slate-400 mb-[16px] tracking-[0.06em] uppercase">
        Quality Score
      </div>

      <div className="flex flex-col items-center gap-[12px]">
        <ScoreRing score={result.score} status={result.status} />

        <span
          className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[7px] text-[12px] font-semibold border ${cfg.bgClass} ${cfg.colorClass} ${cfg.borderClass}`}
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

      <div className="grid grid-cols-2 gap-[8px] mt-[18px]">
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
