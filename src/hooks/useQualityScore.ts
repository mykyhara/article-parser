'use client'
import { useMemo } from 'react'
import type { ParsedArticle, QualityRules, QualityCheckResult } from '@/types'
import { calculateScore } from '@/lib/scoreCalculator'

export function useQualityScore(
  article: ParsedArticle | null,
  rules: QualityRules
): QualityCheckResult | null {
  return useMemo(() => {
    if (!article) return null
    return calculateScore(article, rules)
  }, [article, rules])
}
