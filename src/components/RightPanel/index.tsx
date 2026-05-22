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
    <div className="flex flex-col items-center justify-center h-full gap-[16px] px-[20px]">
      <div className="w-[56px] h-[56px] rounded-[14px] bg-slate-100 border-[1.5px] border-dashed border-slate-300 flex items-center justify-center">
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

      <div className="text-center">
        <p className="text-[15px] font-semibold text-slate-900 m-0 mb-[6px]">
          No document loaded
        </p>
        <p className="text-[13px] text-slate-400 m-0 leading-[1.5]">
          Paste a Google Docs URL to analyse SEO quality
          <br />
          and preview the article content.
        </p>
      </div>

      <button
        onClick={onOpenParse}
        className="flex items-center gap-[7px] px-[20px] py-[10px] rounded-[9px] bg-slate-900 text-white border-0 text-[13px] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(15,23,42,0.18)]"
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
    <div className="flex flex-col gap-[10px]">
      <div className="animate-pulse h-[160px] rounded-xl bg-slate-200" />
      <div className="animate-pulse h-[520px] rounded-xl bg-slate-200" />
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
    <section className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <div className="flex-1 p-[18px_20px_0] overflow-y-auto">
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
