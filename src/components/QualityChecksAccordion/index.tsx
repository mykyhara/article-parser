'use client'
import { useState } from 'react'
import type { ParsedArticle, QualityCheckResult, QualityRules } from '@/types'

type QualityChecksAccordionProps = {
  article: ParsedArticle
  result: QualityCheckResult
  rules: QualityRules
}

type AccordionStatus = 'pass' | 'fail' | 'warn'

const BORDER_COLOR_CLASSES: Record<AccordionStatus, string> = {
  pass: 'border-l-green-500',
  fail: 'border-l-red-500',
  warn: 'border-l-amber-500',
}

function StatusIcon({ status }: { status: AccordionStatus }) {
  const color = { pass: '#22c55e', fail: '#ef4444', warn: '#f59e0b' }[status]
  if (status === 'pass')
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  if (status === 'warn')
    return (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
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
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SmallBadge({
  status,
  children,
}: {
  status: AccordionStatus | 'neutral' | 'blue'
  children: React.ReactNode
}) {
  const classes = {
    pass: 'bg-green-50 text-green-700 border-green-200',
    fail: 'bg-red-50 text-red-800 border-red-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span
      className={`inline-flex items-center gap-[4px] px-[7px] py-[2px] text-[11px] font-medium rounded-md border whitespace-nowrap leading-[1.4] ${classes[status]}`}
    >
      {children}
    </span>
  )
}

function AccordionItem({
  title,
  badge,
  status,
  defaultOpen,
  children,
}: {
  title: string
  badge?: string
  status: AccordionStatus
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const borderColorClass = BORDER_COLOR_CLASSES[status]

  return (
    <div
      className={`bg-white rounded-xl mb-[8px] border border-slate-200 border-l-[3px] ${borderColorClass} overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-[11px_14px] bg-transparent border-0 cursor-pointer text-left"
      >
        <div className="flex items-center gap-[8px]">
          <StatusIcon status={status} />
          <span className="text-[13px] font-semibold text-slate-900">
            {title}
          </span>
          {badge && <SmallBadge status={status}>{badge}</SmallBadge>}
        </div>
        <span
          className={`text-slate-400 flex transition-[transform] duration-200 ${open ? 'rotate-180' : ''}`}
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="p-[0_14px_14px] border-t border-slate-200 fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

function imageRowStatus(img: {
  isGoogleDrive: boolean
  isPublic: boolean
  altTag: string
}): AccordionStatus {
  if (!img.isGoogleDrive) return 'fail'
  if (!img.isPublic) return 'warn'
  return 'pass'
}

export function QualityChecksAccordion({
  article,
  result,
  rules,
}: QualityChecksAccordionProps) {
  const notPublicCount = article.images.filter((img) => !img.isPublic).length
  const notDriveCount = article.images.filter(
    (img) => !img.isGoogleDrive
  ).length
  const imgStatus: AccordionStatus = result.checks.images.pass
    ? 'pass'
    : notPublicCount > 0 || notDriveCount > 0
      ? 'fail'
      : 'fail'
  const linkStatus: AccordionStatus = result.checks.productLinks.pass
    ? 'pass'
    : 'fail'
  const altStatus: AccordionStatus = result.checks.altTags.pass
    ? 'pass'
    : 'fail'
  const fmtStatus: AccordionStatus = result.checks.formatting.pass
    ? 'pass'
    : 'fail'

  const thClass =
    'text-left p-[7px_8px] text-[11px] font-medium text-slate-400 border-b border-slate-200'
  const tdClass =
    'p-[8px_8px] text-[12px] border-b border-slate-200 text-slate-900'

  const missingAltCount = article.images.filter((img) => !img.altTag).length
  const weakAltCount = article.images.filter(
    (img) => img.altTag && img.altTag.length < rules.altTags.minLength
  ).length
  const altBadge =
    missingAltCount > 0 || weakAltCount > 0
      ? `${missingAltCount > 0 ? `${missingAltCount} missing` : ''}${missingAltCount > 0 && weakAltCount > 0 ? ', ' : ''}${weakAltCount > 0 ? `${weakAltCount} weak` : ''}`
      : undefined

  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-400 mb-[10px] tracking-[0.06em] uppercase">
        Quality Checks
      </div>

      <AccordionItem
        title="Images"
        badge={
          article.images.length === 0
            ? 'none found'
            : notPublicCount > 0
              ? `${article.images.length} found · ${notPublicCount} not public`
              : notDriveCount > 0
                ? `${article.images.length} found · ${notDriveCount} not on Drive`
                : `${article.images.length} found`
        }
        status={imgStatus}
        defaultOpen
      >
        <div className="mt-[10px] overflow-x-auto">
          {article.images.length === 0 ? (
            <p className="text-[12px] text-slate-400 italic">
              No images found in the document.
            </p>
          ) : (
            <>
              {(notPublicCount > 0 || notDriveCount > 0) && (
                <div className="flex gap-[8px] items-start p-[9px_11px] mb-[10px] bg-amber-50 border border-amber-200 rounded-lg">
                  <svg
                    width="13"
                    height="13"
                    className="shrink-0 mt-px"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="text-[11.5px] text-amber-800 m-0 leading-[1.55]">
                    {notPublicCount > 0 && (
                      <>
                        {notPublicCount} image{notPublicCount > 1 ? 's' : ''}{' '}
                        hosted on Drive but <strong>not shared publicly</strong>
                        . Open each file in Drive → Share → &ldquo;Anyone with
                        the link can view&rdquo;.
                      </>
                    )}
                    {notDriveCount > 0 && (
                      <>
                        {notDriveCount} image{notDriveCount > 1 ? 's' : ''} are{' '}
                        <strong>not hosted on Google Drive</strong>. Images
                        should be uploaded to Drive and shared publicly.
                      </>
                    )}
                  </p>
                </div>
              )}
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    <th className={`${thClass} w-[28px]`}>#</th>
                    <th className={thClass}>Alt Tag</th>
                    <th className={`${thClass} w-[52px]`}>Drive</th>
                    <th className={`${thClass} w-[60px]`}>Public</th>
                    <th className={`${thClass} w-[52px]`}>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {article.images.map((img) => {
                    const rowStatus = imageRowStatus(img)
                    return (
                      <tr key={img.index}>
                        <td
                          className={`${tdClass} text-slate-400 font-semibold text-[11px]`}
                        >
                          {img.index}
                        </td>
                        <td
                          className={`${tdClass} max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap ${img.altTag ? 'text-slate-900' : 'text-slate-400 italic'}`}
                        >
                          {img.altTag || 'No alt tag'}
                        </td>
                        <td className={tdClass}>
                          <SmallBadge
                            status={img.isGoogleDrive ? 'pass' : 'fail'}
                          >
                            {img.isGoogleDrive ? 'Yes' : 'No'}
                          </SmallBadge>
                        </td>
                        <td className={tdClass}>
                          <SmallBadge status={img.isPublic ? 'pass' : 'warn'}>
                            {img.isPublic ? 'Yes' : 'No'}
                          </SmallBadge>
                        </td>
                        <td className={tdClass}>
                          <StatusIcon status={rowStatus} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </AccordionItem>

      <AccordionItem
        title="Product Links"
        badge={`${article.links.filter((l) => l.isProductLink).length} links`}
        status={linkStatus}
      >
        <div className="mt-[10px]">
          {article.links.length === 0 ? (
            <p className="text-[12px] text-slate-400 italic">No links found.</p>
          ) : (
            <div className="flex flex-col gap-[6px]">
              {article.links.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[8px] p-[7px_10px] bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="text-green-500 flex shrink-0">
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
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  <span className="text-[12px] text-slate-900 font-medium flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {link.text || link.url}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-white px-[7px] py-[2px] rounded border border-slate-200 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0">
                    {link.domain}
                  </span>
                  <span className="text-slate-400 flex shrink-0">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccordionItem>

      <AccordionItem title="Alt Tags" badge={altBadge} status={altStatus}>
        <div className="mt-[10px] flex flex-col gap-[7px]">
          {article.images.length === 0 ? (
            <p className="text-[12px] text-slate-400 italic">
              No images found.
            </p>
          ) : (
            article.images.map((img) => {
              const q = !img.altTag
                ? 'fail'
                : img.altTag.length < rules.altTags.minLength
                  ? 'warn'
                  : 'pass'
              const qLabel = { pass: 'Good', warn: 'Weak', fail: 'Missing' }[q]
              return (
                <div
                  key={img.index}
                  className="p-[9px_11px] bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Image {img.index}
                    </span>
                    <div className="flex items-center gap-[6px]">
                      {img.altTag.length > 0 && (
                        <span className="text-[11px] text-slate-400">
                          {img.altTag.length} chars
                        </span>
                      )}
                      <SmallBadge status={q as AccordionStatus}>
                        {qLabel}
                      </SmallBadge>
                    </div>
                  </div>
                  <p
                    className={`text-[12px] m-0 leading-[1.5] ${img.altTag ? 'text-slate-900' : 'text-slate-400 italic'}`}
                  >
                    {img.altTag || 'No alt tag found'}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </AccordionItem>

      <AccordionItem title="Formatting" status={fmtStatus}>
        <div className="mt-[10px] flex flex-wrap gap-[7px]">
          {[
            {
              label: `${article.formatting.h1Count} H1`,
              ok: article.formatting.h1Count === 1,
            },
            {
              label: `${article.formatting.h2Count} H2s`,
              ok: article.formatting.h2Count >= 1,
            },
            { label: `${article.formatting.wordCount} words`, ok: true },
            {
              label: `${article.formatting.readingTimeMinutes} min read`,
              ok: true,
            },
            {
              label: `${article.formatting.paragraphCount} paragraphs`,
              ok: true,
            },
          ].map((stat, i) => (
            <SmallBadge key={i} status={stat.ok ? 'neutral' : 'fail'}>
              {stat.ok && i < 2 && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {stat.label}
            </SmallBadge>
          ))}
        </div>
      </AccordionItem>
    </div>
  )
}
