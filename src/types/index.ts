export type ArticleImage = {
  index: number
  altTag: string
  isGoogleDrive: boolean
  isPublic: boolean
}

export type ArticleLink = {
  text: string
  url: string
  domain: string
  isProductLink: boolean
}

export type FormattingStats = {
  h1Count: number
  h2Count: number
  h3Count: number
  wordCount: number
  paragraphCount: number
  readingTimeMinutes: number
}

export type ParsedArticle = {
  metaTitle: string
  metaDescription: string
  articleTitle: string
  articleHtml: string
  images: ArticleImage[]
  links: ArticleLink[]
  formatting: FormattingStats
  parsedAt: string
}

export type QualityRules = {
  images: {
    min: number
    max: number
  }
  productLinks: {
    min: number
    max: number
    domainFilter: string
  }
  altTags: {
    minLength: number
  }
}

export const DEFAULT_QUALITY_RULES: QualityRules = {
  images: { min: 3, max: 10 },
  productLinks: { min: 2, max: 20, domainFilter: '' },
  altTags: { minLength: 10 },
}

export type QualityCheckItem = {
  pass: boolean
  details: string
}

export type QualityChecks = {
  images: QualityCheckItem
  productLinks: QualityCheckItem
  altTags: QualityCheckItem
  formatting: QualityCheckItem
}

export type QualityStatus = 'PASS' | 'NEEDS_REVIEW' | 'FAIL'

export type QualityCheckResult = {
  score: number
  status: QualityStatus
  checks: QualityChecks
}

export type UploadPayload = {
  metaTitle: string
  metaDescription: string
  articleTitle: string
  articleHtml: string
}

export type UploadResponse = {
  success: boolean
  wordpressPostId: number
  postUrl: string
  publishedAt: string
  message: string
}

export type ApiError = {
  message: string
  status: number
}
