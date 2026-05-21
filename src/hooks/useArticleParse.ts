'use client'
import { useState, useCallback } from 'react'
import type { ParsedArticle, ApiError } from '@/types'

export function useArticleParse() {
  const [article, setArticle] = useState<ParsedArticle | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [parsedAt, setParsedAt] = useState<Date | null>(null)
  const [activeDocUrl, setActiveDocUrl] = useState<string>('')

  const parse = useCallback(async (docUrl: string) => {
    setIsLoading(true)
    setError(null)
    setActiveDocUrl(docUrl)
    try {
      const res = await fetch(`/api/parse?docId=${encodeURIComponent(docUrl)}`)
      if (!res.ok) {
        const data = (await res.json()) as { message?: string }
        setError({
          message: data.message ?? 'Parse failed',
          status: res.status,
        })
        return
      }
      const data = (await res.json()) as ParsedArticle
      setArticle(data)
      setParsedAt(new Date())
    } catch {
      setError({
        message: 'Network error — could not reach the server',
        status: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reParse = useCallback(() => {
    if (activeDocUrl) void parse(activeDocUrl)
  }, [activeDocUrl, parse])

  const reset = useCallback(() => {
    setArticle(null)
    setError(null)
    setParsedAt(null)
    setActiveDocUrl('')
  }, [])

  return {
    article,
    isLoading,
    error,
    parse,
    reParse,
    reset,
    parsedAt,
    activeDocUrl,
  }
}
