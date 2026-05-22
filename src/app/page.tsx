'use client'
import { useState } from 'react'
import {
  Header,
  LeftPanel,
  RightPanel,
  SettingsPanel,
  UploadModal,
  ParseModal,
} from '@/components'
import { useArticleParse } from '@/hooks/useArticleParse'
import { useQualityScore } from '@/hooks/useQualityScore'
import { useSettings } from '@/hooks/useSettings'
import type { QualityRules, UploadPayload } from '@/types'

function extractDocId(urlOrId: string): string {
  const match = urlOrId.match(/\/document\/d\/([\w-]+)/)
  return match?.[1] ?? urlOrId
}

export default function HomePage() {
  const { rules, setRules } = useSettings()
  const {
    article,
    isLoading,
    error,
    parse,
    reParse,
    reset,
    parsedAt,
    activeDocUrl,
  } = useArticleParse()
  const qualityResult = useQualityScore(article, rules)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [parseModalOpen, setParseModalOpen] = useState(false)

  const [editedMeta, setEditedMeta] = useState<{
    metaTitle?: string
    metaDescription?: string
    articleTitle?: string
  }>({})

  const metaTitle = editedMeta.metaTitle ?? article?.metaTitle ?? ''
  const metaDescription =
    editedMeta.metaDescription ?? article?.metaDescription ?? ''
  const articleTitle = editedMeta.articleTitle ?? article?.articleTitle ?? ''

  function handleMetaChange(
    field: 'metaTitle' | 'metaDescription' | 'articleTitle',
    value: string
  ) {
    setEditedMeta((prev) => ({ ...prev, [field]: value }))
  }

  function handleParse(url: string) {
    setEditedMeta({})
    void parse(url)
  }

  function handleUploadSuccess() {
    reset()
    setEditedMeta({})
  }

  const uploadPayload: UploadPayload | null = article
    ? {
        metaTitle,
        metaDescription,
        articleTitle,
        articleHtml: article.articleHtml,
      }
    : null

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Header
        parsedAt={parsedAt}
        onOpenParse={() => setParseModalOpen(true)}
        onReParse={reParse}
        onOpenSettings={() => setSettingsOpen(true)}
        docId={activeDocUrl ? extractDocId(activeDocUrl) : ''}
        isLoading={isLoading}
        hasArticle={!!article}
      />

      <div className="flex flex-1 min-h-0">
        <LeftPanel
          article={article}
          qualityResult={qualityResult}
          rules={rules}
          isLoading={isLoading}
          error={error}
          onOpenParse={() => setParseModalOpen(true)}
        />
        <RightPanel
          article={article}
          isLoading={isLoading}
          hasError={!!error}
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          articleTitle={articleTitle}
          onMetaChange={handleMetaChange}
          qualityResult={qualityResult}
          onUpload={() => setUploadModalOpen(true)}
          onOverride={() => setUploadModalOpen(true)}
          onOpenParse={() => setParseModalOpen(true)}
        />
      </div>

      <SettingsPanel
        open={settingsOpen}
        rules={rules}
        onApply={(newRules: QualityRules) => setRules(newRules)}
        onClose={() => setSettingsOpen(false)}
      />

      <UploadModal
        open={uploadModalOpen}
        payload={uploadPayload}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <ParseModal
        open={parseModalOpen}
        isLoading={isLoading}
        onParse={handleParse}
        onClose={() => setParseModalOpen(false)}
      />
    </div>
  )
}
