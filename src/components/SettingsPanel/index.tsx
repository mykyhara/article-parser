'use client'
import { useState, useEffect } from 'react'
import type { QualityRules } from '@/types'
import { DEFAULT_QUALITY_RULES } from '@/types'

type SettingsPanelProps = {
  open: boolean
  rules: QualityRules
  onApply: (rules: QualityRules) => void
  onClose: () => void
}

const labelS: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#475569',
  display: 'block',
  marginBottom: 5,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}
const inputS: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  color: '#0f172a',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '7px 10px',
  background: '#ffffff',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
const groupTitleS: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94a3b8',
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: '1px solid #e2e8f0',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

export function SettingsPanel({
  open,
  rules,
  onApply,
  onClose,
}: SettingsPanelProps) {
  const [draft, setDraft] = useState<QualityRules>(rules)
  const [domainInput, setDomainInput] = useState('')
  const [domains, setDomains] = useState<string[]>(
    rules.productLinks.domainFilter ? [rules.productLinks.domainFilter] : []
  )

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(rules)

      setDomains(
        rules.productLinks.domainFilter ? [rules.productLinks.domainFilter] : []
      )
    }
  }, [open, rules])

  function updateNum(
    section: keyof QualityRules,
    field: string,
    value: string
  ) {
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    setDraft((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: num },
    }))
  }

  function addDomain() {
    const trimmed = domainInput.trim()
    if (trimmed && !domains.includes(trimmed)) {
      setDomains((d) => [...d, trimmed])
      setDomainInput('')
    }
  }

  function removeDomain(d: string) {
    setDomains((ds) => ds.filter((x) => x !== d))
  }

  function handleApply() {
    onApply({
      ...draft,
      productLinks: { ...draft.productLinks, domainFilter: domains[0] ?? '' },
    })
    onClose()
  }

  function handleReset() {
    setDraft(DEFAULT_QUALITY_RULES)
    setDomains([])
    setDomainInput('')
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 376,
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          boxShadow: '-6px 0 32px rgba(0,0,0,0.1)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              Quality Rules Configuration
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Set thresholds for all checks
            </div>
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={groupTitleS}>Images</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {(
                [
                  ['min', 'Min Images'],
                  ['max', 'Max Images'],
                ] as const
              ).map(([k, lbl]) => (
                <div key={k}>
                  <label style={labelS}>{lbl}</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.images[k]}
                    onChange={(e) => updateNum('images', k, e.target.value)}
                    style={inputS}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={groupTitleS}>Product Links</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 14,
              }}
            >
              {(
                [
                  ['min', 'Min Links'],
                  ['max', 'Max Links'],
                ] as const
              ).map(([k, lbl]) => (
                <div key={k}>
                  <label style={labelS}>{lbl}</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.productLinks[k]}
                    onChange={(e) =>
                      updateNum('productLinks', k, e.target.value)
                    }
                    style={inputS}
                  />
                </div>
              ))}
            </div>
            <div>
              <label style={labelS}>Domain Filter</label>
              {domains.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  {domains.map((d) => (
                    <span
                      key={d}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {d}
                      <button
                        onClick={() => removeDomain(d)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#3b82f6',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: 1,
                        }}
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={domainInput}
                  placeholder="e.g. example.com"
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                  style={{ ...inputS, flex: 1 }}
                />
                <button
                  onClick={addDomain}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={groupTitleS}>Alt Tags</div>
            <div>
              <label style={labelS}>Min Alt Tag Length</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  min={1}
                  value={draft.altTags.minLength}
                  onChange={(e) =>
                    updateNum('altTags', 'minLength', e.target.value)
                  }
                  style={{ ...inputS, width: 80 }}
                />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  characters
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                Alt tags shorter than this threshold will be marked as{' '}
                <strong style={{ fontWeight: 600 }}>Weak</strong>
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '16px 22px',
            borderTop: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: '#94a3b8',
              textDecoration: 'underline',
              fontFamily: 'Inter, sans-serif',
              marginBottom: 12,
              display: 'block',
            }}
          >
            Reset to defaults
          </button>
          <button
            onClick={handleApply}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 8,
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              border: 'none',
              transition: 'background 0.15s',
            }}
          >
            Apply Rules
          </button>
        </div>
      </div>
    </>
  )
}
