'use client'
import { useState, useCallback } from 'react'
import type { QualityRules } from '@/types'
import { DEFAULT_QUALITY_RULES } from '@/types'

const STORAGE_KEY = 'articleqa:settings'

function loadFromStorage(): QualityRules {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_QUALITY_RULES
    const parsed = JSON.parse(raw) as Partial<QualityRules>
    return {
      images: { ...DEFAULT_QUALITY_RULES.images, ...parsed.images },
      productLinks: {
        ...DEFAULT_QUALITY_RULES.productLinks,
        ...parsed.productLinks,
      },
      altTags: { ...DEFAULT_QUALITY_RULES.altTags, ...parsed.altTags },
    }
  } catch {
    return DEFAULT_QUALITY_RULES
  }
}

export function useSettings() {
  const [rules, setRulesState] = useState<QualityRules>(() => {
    if (typeof window === 'undefined') return DEFAULT_QUALITY_RULES
    return loadFromStorage()
  })

  const setRules = useCallback((next: QualityRules) => {
    setRulesState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const resetToDefaults = useCallback(() => {
    setRulesState(DEFAULT_QUALITY_RULES)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return { rules, setRules, resetToDefaults }
}
