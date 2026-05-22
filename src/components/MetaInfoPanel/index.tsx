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
  const style = over
    ? { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' }
    : close
      ? { bg: '#fffbeb', color: '#92400e', border: '#fde68a' }
      : { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 6,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontFamily: 'monospace',
      }}
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
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '18px 18px 4px',
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
        Meta &amp; Article Info
      </div>

      {FIELDS.map(({ key, label, limit, multi }) => {
        const value = values[key]
        const isFocused = focused === key
        const isHovered = hovered === key

        const borderColor = isFocused ? '#3b82f6' : '#e2e8f0'
        const boxShadow = isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none'

        const inputStyle: React.CSSProperties = {
          width: '100%',
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: '#0f172a',
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          padding: '8px 12px',
          background: '#ffffff',
          outline: 'none',
          resize: multi ? 'vertical' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow,
        }

        return (
          <div
            key={key}
            style={{ marginBottom: 14 }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {limit !== null && (
                  <CharBadge count={value.length} limit={limit} />
                )}
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'flex',
                    opacity: isHovered || isFocused ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }}
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
                style={inputStyle}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(key, e.target.value)}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
                style={inputStyle}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
