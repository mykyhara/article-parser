'use client'
import { QualityScoreCard } from '@/components/QualityScoreCard'
import { QualityChecksAccordion } from '@/components/QualityChecksAccordion'
import type {
  ParsedArticle,
  QualityCheckResult,
  QualityRules,
  ApiError,
} from '@/types'

type LeftPanelProps = {
  article: ParsedArticle | null
  qualityResult: QualityCheckResult | null
  rules: QualityRules
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
  rules,
  isLoading,
  error,
  onOpenParse,
}: LeftPanelProps) {
  return (
    <aside className="w-[36%] min-w-[300px] max-w-[420px] overflow-y-auto py-[18px] pr-[14px] pl-[20px] border-r border-slate-200 bg-slate-50 flex flex-col">
      {(isLoading || qualityResult) && (
        <QualityScoreCard result={qualityResult} />
      )}

      {error && (
        <div className="p-[14px_16px] bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-800 mb-[10px]">
          <p className="font-semibold mb-[4px]">Failed to parse document</p>
          <p className="text-red-900 text-[12px] leading-[1.5] mb-[8px]">
            {error.message}
          </p>
          <button
            onClick={onOpenParse}
            className="bg-transparent border-none cursor-pointer text-[12px] text-red-600 underline p-0 font-sans"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-[8px]">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse h-[44px] rounded-[10px] bg-slate-200"
            />
          ))}
        </div>
      )}

      {!article && !isLoading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-[20px] py-[24px] px-[8px]">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-slate-100 border-[1.5px] border-dashed border-slate-300 flex items-center justify-center">
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

          <div className="text-center">
            <p className="text-[14px] font-semibold text-slate-600 mb-[6px]">
              Quality checks
            </p>
            <p className="text-[12px] text-slate-400 m-0 leading-[1.6]">
              Parse a Google Doc to run
              <br />
              the following checks:
            </p>
          </div>

          <div className="w-full flex flex-col gap-[6px]">
            {CHECK_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-[10px] p-[9px_12px] rounded-[9px] bg-white border border-slate-200"
              >
                <span className="text-slate-400 flex shrink-0 mt-[2px]">
                  {item.svg}
                </span>
                <div>
                  <div className="text-[12px] font-semibold text-slate-600">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-[1px]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {article && qualityResult && (
        <QualityChecksAccordion
          article={article}
          result={qualityResult}
          rules={rules}
        />
      )}
    </aside>
  )
}
