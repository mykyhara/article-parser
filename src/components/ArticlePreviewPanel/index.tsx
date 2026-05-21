'use client'
import { useState, useEffect, useRef } from 'react'

type ArticlePreviewPanelProps = {
  articleHtml: string
}

function useHydratePlaceholders(
  ref: React.RefObject<HTMLDivElement | null>,
  html: string
) {
  useEffect(() => {
    const container = ref.current
    if (!container) return

    container
      .querySelectorAll<HTMLElement>('figure.img-placeholder')
      .forEach((fig) => {
        if (fig.dataset['hydrated']) return
        fig.dataset['hydrated'] = '1'

        const index = fig.dataset['index'] ?? ''
        const alt = fig.dataset['alt'] ?? ''
        const drive = fig.dataset['drive'] ?? ''

        const publicKnown = fig.hasAttribute('data-public')
        const pub = fig.getAttribute('data-public')

        fig.innerHTML = `
        <span class="ph-index">Image ${index}</span>
        ${publicKnown ? `<span class="ph-badge ${pub === 'true' ? 'public' : 'private'}">${pub === 'true' ? '✓ Public' : '⚠ Not public'}</span>` : ''}
        <svg class="ph-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        ${alt ? `<span class="ph-alt" title="${alt}">"${alt}"</span>` : '<span class="ph-alt">No alt tag</span>'}
        ${
          drive
            ? `<a href="${drive}" target="_blank" rel="noopener noreferrer" style="position:absolute;bottom:8px;right:10px;font-size:10px;color:#94a3b8;text-decoration:none;display:flex;align-items:center;gap:3px;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Drive
        </a>`
            : ''
        }
      `
      })
  }, [html, ref])
}

function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useHydratePlaceholders(ref, html)

  return (
    <div
      ref={ref}
      className="article-body"
      style={{ minHeight: 200, overflowY: 'auto', paddingBottom: 24 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function ArticlePreviewPanel({ articleHtml }: ArticlePreviewPanelProps) {
  const [tab, setTab] = useState<'preview' | 'html'>('preview')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(articleHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard denied */
    }
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '18px 18px 0',
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#94a3b8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Article Preview
        </div>
        <div
          style={{
            display: 'flex',
            background: '#f8fafc',
            borderRadius: 8,
            padding: 3,
            border: '1px solid #e2e8f0',
            gap: 2,
          }}
        >
          {(['preview', 'html'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                background: tab === key ? '#ffffff' : 'transparent',
                color: tab === key ? '#0f172a' : '#94a3b8',
                boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.12s',
              }}
            >
              {key === 'preview' ? 'Preview' : 'Raw HTML'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' ? (
        <ArticleBody html={articleHtml} />
      ) : (
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              transition: 'all 0.15s',
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
          <pre
            style={{
              maxHeight: 520,
              overflowY: 'auto',
              margin: 0,
              padding: '14px 14px 18px',
              background: '#0f172a',
              color: '#94a3b8',
              borderRadius: '0 0 10px 10px',
              fontSize: 12,
              lineHeight: 1.65,
              fontFamily:
                "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            <code style={{ color: '#e2e8f0' }}>{articleHtml}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
