'use client'
import { useState } from 'react'

type MetaField = 'metaTitle' | 'metaDescription' | 'articleTitle'

type MetaInfoPanelProps = {
  metaTitle: string
  metaDescription: string
  articleTitle: string
  onChange: (field: MetaField, value: string) => void
}

type FieldConfig = {
  key: MetaField
  label: string
  limit: number | null
  multi: boolean
}

const FIELDS: FieldConfig[] = [
  { key: 'metaTitle', label: 'Meta Title', limit: 60, multi: false },
  {
    key: 'metaDescription',
    label: 'Meta Description',
    limit: 160,
    multi: true,
  },
  { key: 'articleTitle', label: 'Article Title', limit: null, multi: false },
]

function CharBadge({ count, limit }: { count: number; limit: number }) {
  const over = count > limit
  const close = count > limit * 0.94
  const classes = over
    ? 'bg-red-50 text-red-800 border-red-200'
    : close
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-green-50 text-green-700 border-green-200'
  return (
    <span
      className={`inline-flex items-center px-[6px] py-[2px] text-[11px] font-medium rounded-md border font-mono ${classes}`}
    >
      {count}/{limit}
    </span>
  )
}

export function MetaInfoPanel({
  metaTitle,
  metaDescription,
  articleTitle,
  onChange,
}: MetaInfoPanelProps) {
  const [focused, setFocused] = useState<MetaField | null>(null)
  const [hovered, setHovered] = useState<MetaField | null>(null)

  const values: Record<MetaField, string> = {
    metaTitle,
    metaDescription,
    articleTitle,
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-[18px_18px_4px] mb-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="text-[11px] font-semibold text-slate-400 mb-[16px] tracking-[0.06em] uppercase">
        Meta &amp; Article Info
      </div>

      {FIELDS.map(({ key, label, limit, multi }) => {
        const value = values[key]
        const isFocused = focused === key
        const isHovered = hovered === key

        const inputCls = [
          'w-full text-[13px] text-slate-900 rounded-lg p-[8px_12px] bg-white outline-none',
          'border transition-[border-color,box-shadow] duration-150',
          multi ? 'resize-y' : 'resize-none',
          isFocused
            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
            : 'border-slate-200',
        ].join(' ')

        return (
          <div
            key={key}
            className="mb-[14px]"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center justify-between mb-[5px]">
              <label className="text-[11px] font-semibold text-slate-400 tracking-[0.06em] uppercase">
                {label}
              </label>
              <div className="flex items-center gap-[6px]">
                {limit !== null && (
                  <CharBadge count={value.length} limit={limit} />
                )}
                <span
                  className={`text-slate-400 flex transition-opacity duration-150 ${isHovered || isFocused ? 'opacity-100' : 'opacity-0'}`}
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
                  </svg>
                </span>
              </div>
            </div>

            {multi ? (
              <textarea
                value={value}
                rows={3}
                onChange={(e) => onChange(key, e.target.value)}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
                className={inputCls}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
                className={inputCls}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
