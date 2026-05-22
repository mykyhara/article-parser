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
      className="article-body min-h-[200px] overflow-y-auto pb-6"
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
    } catch {}
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-[18px_18px_0] mb-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-[14px]">
        <div className="text-[11px] font-semibold text-slate-400 tracking-[0.06em] uppercase">
          Article Preview
        </div>
        <div className="flex bg-slate-50 rounded-lg p-[3px] border border-slate-200 gap-[2px]">
          {(['preview', 'html'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-[12px] py-[4px] rounded-md border-0 cursor-pointer text-[12px] font-medium transition-all ${
                tab === key
                  ? 'bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'bg-transparent text-slate-400'
              }`}
            >
              {key === 'preview' ? 'Preview' : 'Raw HTML'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' ? (
        <ArticleBody html={articleHtml} />
      ) : (
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-[10px] right-[10px] z-[2] flex items-center gap-[5px] px-[10px] py-[5px] rounded-md text-[11px] font-medium cursor-pointer bg-slate-800 text-slate-400 border border-slate-700 transition-all"
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
          <pre className="font-code max-h-[520px] overflow-y-auto m-0 p-[14px_14px_18px] bg-slate-900 text-slate-400 rounded-[0_0_10px_10px] text-[12px] leading-[1.65] whitespace-pre-wrap break-all">
            <code className="text-slate-200">{articleHtml}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
