'use client'
import { useState } from 'react'
import type { ParsedArticle, QualityCheckResult, QualityRules } from '@/types'

type QualityChecksAccordionProps = {
  article: ParsedArticle
  result: QualityCheckResult
  rules: QualityRules
}

type AccordionStatus = 'pass' | 'fail' | 'warn'

const BORDER_COLORS: Record<AccordionStatus, string> = {
  pass: '#22c55e',
  fail: '#ef4444',
  warn: '#f59e0b',
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
  const styles = {
    pass: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    fail: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    warn: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    neutral: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
    blue: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  }
  const s = styles[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 7px',
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 6,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
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
  const borderColor = BORDER_COLORS[status]

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        marginBottom: 8,
        border: '1px solid #e2e8f0',
        borderLeft: `3px solid ${borderColor}`,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusIcon status={status} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
            {title}
          </span>
          {badge && <SmallBadge status={status}>{badge}</SmallBadge>}
        </div>
        <span
          style={{
            color: '#94a3b8',
            display: 'flex',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          style={{ padding: '0 14px 14px', borderTop: '1px solid #e2e8f0' }}
          className="fade-in"
        >
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

  const thS: React.CSSProperties = {
    textAlign: 'left',
    padding: '7px 8px',
    fontSize: 11,
    fontWeight: 500,
    color: '#94a3b8',
    borderBottom: '1px solid #e2e8f0',
  }
  const tdS: React.CSSProperties = {
    padding: '8px 8px',
    fontSize: 12,
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a',
  }

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
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#94a3b8',
          marginBottom: 10,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
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
        <div style={{ marginTop: 10, overflowX: 'auto' }}>
          {article.images.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
              No images found in the document.
            </p>
          ) : (
            <>
              {(notPublicCount > 0 || notDriveCount > 0) && (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    padding: '9px 11px',
                    marginBottom: 10,
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 8,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    style={{ flexShrink: 0, marginTop: 1 }}
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
                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#92400e',
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
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
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...thS, width: 28 }}>#</th>
                    <th style={thS}>Alt Tag</th>
                    <th style={{ ...thS, width: 52 }}>Drive</th>
                    <th style={{ ...thS, width: 60 }}>Public</th>
                    <th style={{ ...thS, width: 52 }}>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {article.images.map((img) => {
                    const rowStatus = imageRowStatus(img)
                    return (
                      <tr key={img.index}>
                        <td
                          style={{
                            ...tdS,
                            color: '#94a3b8',
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        >
                          {img.index}
                        </td>
                        <td
                          style={{
                            ...tdS,
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: img.altTag ? '#0f172a' : '#94a3b8',
                            fontStyle: img.altTag ? 'normal' : 'italic',
                          }}
                        >
                          {img.altTag || 'No alt tag'}
                        </td>
                        <td style={tdS}>
                          <SmallBadge
                            status={img.isGoogleDrive ? 'pass' : 'fail'}
                          >
                            {img.isGoogleDrive ? 'Yes' : 'No'}
                          </SmallBadge>
                        </td>
                        <td style={tdS}>
                          <SmallBadge status={img.isPublic ? 'pass' : 'warn'}>
                            {img.isPublic ? 'Yes' : 'No'}
                          </SmallBadge>
                        </td>
                        <td style={tdS}>
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
        <div style={{ marginTop: 10 }}>
          {article.links.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
              No links found.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {article.links.map((link, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span
                    style={{ color: '#22c55e', display: 'flex', flexShrink: 0 }}
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
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#0f172a',
                      fontWeight: 500,
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.text || link.url}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      background: '#ffffff',
                      padding: '2px 7px',
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {link.domain}
                  </span>
                  <span
                    style={{ color: '#94a3b8', display: 'flex', flexShrink: 0 }}
                  >
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
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          {article.images.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
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
                  style={{
                    padding: '9px 11px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#94a3b8',
                      }}
                    >
                      Image {img.index}
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {img.altTag.length > 0 && (
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {img.altTag.length} chars
                        </span>
                      )}
                      <SmallBadge status={q as AccordionStatus}>
                        {qLabel}
                      </SmallBadge>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: img.altTag ? '#0f172a' : '#94a3b8',
                      fontStyle: img.altTag ? 'normal' : 'italic',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
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
        <div
          style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 7 }}
        >
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
