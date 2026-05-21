import type {
  ParsedArticle,
  QualityRules,
  QualityCheckResult,
  QualityChecks,
} from '@/types'

export function calculateScore(
  article: ParsedArticle,
  rules: QualityRules
): QualityCheckResult {
  const imageCount = article.images.length
  const countInRange =
    imageCount >= rules.images.min && imageCount <= rules.images.max

  const notOnDrive = article.images.filter((img) => !img.isGoogleDrive).length
  const notPublic = article.images.filter((img) => !img.isPublic).length
  const accessOk = notOnDrive === 0 && notPublic === 0

  const imagesPass = countInRange && accessOk

  let imagesDetail: string
  if (!countInRange) {
    imagesDetail = `${imageCount} images (expected ${rules.images.min}–${rules.images.max})`
  } else if (notOnDrive > 0) {
    imagesDetail = `${notOnDrive} image${notOnDrive > 1 ? 's' : ''} not hosted on Google Drive`
  } else if (notPublic > 0) {
    imagesDetail = `${notPublic} image${notPublic > 1 ? 's' : ''} not shared publicly — must be "Anyone with the link"`
  } else {
    imagesDetail = `${imageCount} images on Drive, all public`
  }

  const imagesCheck = { pass: imagesPass, details: imagesDetail }

  const productLinks = rules.productLinks.domainFilter
    ? article.links.filter((l) =>
        l.domain
          .toLowerCase()
          .includes(rules.productLinks.domainFilter.toLowerCase())
      )
    : article.links.filter((l) => l.isProductLink)

  const linkCount = productLinks.length
  const linksInRange =
    linkCount >= rules.productLinks.min && linkCount <= rules.productLinks.max
  const productLinksCheck = {
    pass: linksInRange,
    details: linksInRange
      ? `${linkCount} product links (within ${rules.productLinks.min}–${rules.productLinks.max})`
      : `${linkCount} product links (expected ${rules.productLinks.min}–${rules.productLinks.max})`,
  }

  const altTagIssues = article.images.filter(
    (img) => !img.altTag || img.altTag.length < rules.altTags.minLength
  )
  const altTagsPass = altTagIssues.length === 0
  const altTagsCheck = {
    pass: altTagsPass,
    details: altTagsPass
      ? `All alt tags present and ≥${rules.altTags.minLength} chars`
      : `${altTagIssues.length} image(s) with missing or short alt tags (<${rules.altTags.minLength} chars)`,
  }

  const { h1Count, h2Count } = article.formatting
  const formattingPass = h1Count === 1 && h2Count >= 1
  const formattingCheck = {
    pass: formattingPass,
    details: formattingPass
      ? `${h1Count} H1, ${h2Count} H2s — valid`
      : `${h1Count} H1 (need exactly 1), ${h2Count} H2 (need ≥1)`,
  }

  const checks: QualityChecks = {
    images: imagesCheck,
    productLinks: productLinksCheck,
    altTags: altTagsCheck,
    formatting: formattingCheck,
  }

  const score =
    (imagesPass ? 25 : 0) +
    (linksInRange ? 25 : 0) +
    (altTagsPass ? 25 : 0) +
    (formattingPass ? 25 : 0)

  const status = score === 100 ? 'PASS' : score >= 75 ? 'NEEDS_REVIEW' : 'FAIL'

  return { score, status, checks }
}
