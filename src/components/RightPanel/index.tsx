'use client'

import { MetaInfoPanel } from '@/components/MetaInfoPanel'
import { ArticlePreviewPanel } from '@/components/ArticlePreviewPanel'
import { UploadBar } from '@/components/UploadBar'
import type { ParsedArticle, QualityCheckResult } from '@/types'

type RightPanelProps = {
  article: ParsedArticle | null
  isLoading: boolean
  hasError: boolean
  metaTitle: string
  metaDescription: string
  articleTitle: string
  onMetaChange: (
    field: 'metaTitle' | 'metaDescription' | 'articleTitle',
    value: string
  ) => void
  qualityResult: QualityCheckResult | null
  onUpload: () => void
  onOverride: () => void
  onOpenParse: () => void
}

function EmptyState({ onOpenParse }: { onOpenParse: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 16,
        padding: '0 20px',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: '#f1f5f9',
          border: '1.5px dashed #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#0f172a',
            margin: '0 0 6px',
          }}
        >
          No document loaded
        </p>
        <p
          style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}
        >
          Paste a Google Docs URL to analyse SEO quality
          <br />
          and preview the article content.
        </p>
      </div>

      <button
        onClick={onOpenParse}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '10px 20px',
          borderRadius: 9,
          background: '#0f172a',
          color: '#ffffff',
          border: 'none',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 2px 8px rgba(15,23,42,0.18)',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Parse Document
      </button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        className="animate-pulse"
        style={{ height: 160, borderRadius: 12, background: '#e2e8f0' }}
      />
      <div
        className="animate-pulse"
        style={{ height: 520, borderRadius: 12, background: '#e2e8f0' }}
      />
    </div>
  )
}

export function RightPanel({
  article,
  isLoading,
  hasError,
  metaTitle,
  metaDescription,
  articleTitle,
  onMetaChange,
  qualityResult,
  onUpload,
  onOverride,
  onOpenParse,
}: RightPanelProps) {
  return (
    <section
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowY: 'auto',
      }}
    >
      <div style={{ flex: 1, padding: '18px 20px 0', overflowY: 'auto' }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : article ? (
          <>
            <MetaInfoPanel
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              articleTitle={articleTitle}
              onChange={onMetaChange}
            />
            <ArticlePreviewPanel articleHtml={article.articleHtml} />
          </>
        ) : !hasError ? (
          <EmptyState onOpenParse={onOpenParse} />
        ) : null}
      </div>

      <UploadBar
        result={qualityResult}
        isLoading={isLoading}
        hasError={hasError}
        onUpload={onUpload}
        onOverride={onOverride}
      />
    </section>
  )
}
