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

const labelCls =
  'text-[11px] font-semibold text-slate-600 block mb-[5px] tracking-[0.04em] uppercase'
const inputCls =
  'text-[13px] text-slate-900 border border-slate-200 rounded-[8px] p-[7px_10px] bg-white outline-none w-full transition-[border-color,box-shadow] duration-150'
const groupTitleCls =
  'text-[11px] font-bold text-slate-400 mb-[12px] pb-[8px] border-b border-slate-200 tracking-[0.08em] uppercase'

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
        className={`fixed inset-0 bg-[rgba(15,23,42,0.35)] backdrop-blur-[2px] z-40 transition-opacity duration-[250ms] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-[376px] bg-white border-l border-slate-200 shadow-[-6px_0_32px_rgba(0,0,0,0.1)] z-50 flex flex-col transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-[18px_22px] border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[15px] font-bold text-slate-900">
              Quality Rules Configuration
            </div>
            <div className="text-[12px] text-slate-400 mt-[2px]">
              Set thresholds for all checks
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-slate-400 p-[6px] rounded-[6px] flex items-center"
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

        <div className="flex-1 overflow-y-auto p-[22px]">
          <div className="mb-[24px]">
            <div className={groupTitleCls}>Images</div>
            <div className="grid grid-cols-2 gap-[12px]">
              {(
                [
                  ['min', 'Min Images'],
                  ['max', 'Max Images'],
                ] as const
              ).map(([k, lbl]) => (
                <div key={k}>
                  <label className={labelCls}>{lbl}</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.images[k]}
                    onChange={(e) => updateNum('images', k, e.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-[24px]">
            <div className={groupTitleCls}>Product Links</div>
            <div className="grid grid-cols-2 gap-[12px] mb-[14px]">
              {(
                [
                  ['min', 'Min Links'],
                  ['max', 'Max Links'],
                ] as const
              ).map(([k, lbl]) => (
                <div key={k}>
                  <label className={labelCls}>{lbl}</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.productLinks[k]}
                    onChange={(e) =>
                      updateNum('productLinks', k, e.target.value)
                    }
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className={labelCls}>Domain Filter</label>
              {domains.length > 0 && (
                <div className="flex flex-wrap gap-[6px] mb-[8px]">
                  {domains.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-[5px] bg-blue-50 text-blue-700 border border-blue-200 rounded-[6px] px-[8px] py-[3px] text-[12px] font-medium"
                    >
                      {d}
                      <button
                        onClick={() => removeDomain(d)}
                        className="bg-transparent border-none cursor-pointer text-blue-500 p-0 flex items-center leading-[1]"
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
              <div className="flex gap-[6px]">
                <input
                  type="text"
                  value={domainInput}
                  placeholder="e.g. example.com"
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={addDomain}
                  className="px-[12px] py-[7px] rounded-[8px] border border-slate-200 bg-slate-100 text-slate-600 text-[12px] font-medium cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="mb-[24px]">
            <div className={groupTitleCls}>Alt Tags</div>
            <div>
              <label className={labelCls}>Min Alt Tag Length</label>
              <div className="flex items-center gap-[10px]">
                <input
                  type="number"
                  min={1}
                  value={draft.altTags.minLength}
                  onChange={(e) =>
                    updateNum('altTags', 'minLength', e.target.value)
                  }
                  className={`${inputCls} w-[80px]`}
                />
                <span className="text-[12px] text-slate-400">characters</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-[6px] leading-[1.5]">
                Alt tags shorter than this threshold will be marked as{' '}
                <strong className="font-semibold">Weak</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="p-[16px_22px] border-t border-slate-200 shrink-0">
          <button
            onClick={handleReset}
            className="bg-transparent border-none cursor-pointer text-[12px] text-slate-400 underline mb-[12px] block"
          >
            Reset to defaults
          </button>
          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-[6px] px-[16px] py-[10px] rounded-[8px] bg-slate-900 text-white text-[13px] font-semibold cursor-pointer border-none transition-[background] duration-150"
          >
            Apply Rules
          </button>
        </div>
      </div>
    </>
  )
}
