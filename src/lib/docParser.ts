import * as cheerio from 'cheerio'
import type {
  ParsedArticle,
  ArticleImage,
  ArticleLink,
  FormattingStats,
} from '@/types'

type DomElem = { tagName?: string; type?: string; data?: string }
type DomText = { type: 'text'; data?: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDomNode = any

const EXPORT_URL = (docId: string) =>
  `https://docs.google.com/document/d/${docId}/export?format=html`

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function countWords(text: string): number {
  return text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

export async function parseGoogleDoc(docId: string): Promise<ParsedArticle> {
  const exportUrl = EXPORT_URL(docId)

  const res = await fetch(exportUrl, {
    cache: 'no-store',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; ArticleQA/1.0; +https://github.com/articleqa)',
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Google Doc (HTTP ${res.status}). Make sure the document is shared publicly ("Anyone with the link can view").`
    )
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  const allParas = $('body p').toArray()
  const firstNonEmpty = allParas.filter((el) => $(el).text().trim().length > 0)

  function stripMetaLabel(text: string): string {
    return text
      .replace(/^meta\s+title\s*:\s*/i, '')
      .replace(/^meta\s+description\s*:\s*/i, '')
      .trim()
  }

  const rawMetaTitle = firstNonEmpty[0] ? $(firstNonEmpty[0]).text().trim() : ''
  const rawMetaDesc = firstNonEmpty[1] ? $(firstNonEmpty[1]).text().trim() : ''
  const metaTitle = stripMetaLabel(rawMetaTitle)
  const metaDescription = stripMetaLabel(rawMetaDesc)

  const metaPara0 = firstNonEmpty[0]
  const metaPara1 = firstNonEmpty[1]
  if (metaPara0) $(metaPara0).attr('data-meta', 'title')
  if (metaPara1) $(metaPara1).attr('data-meta', 'description')

  const firstH1 = $('body h1').first()
  const articleTitle = firstH1.text().trim() || metaTitle

  type RawImageData = {
    index: number
    driveUrl: string
    fileId: string
    altTag: string
    paraEl: AnyDomNode
  }
  const rawImages: RawImageData[] = []

  function unwrapGoogleUrl(raw: string): string {
    try {
      const parsed = new URL(raw)
      if (parsed.hostname === 'www.google.com' && parsed.pathname === '/url') {
        return parsed.searchParams.get('q') ?? raw
      }
    } catch {}
    return raw
  }

  $('body p').each((_i, el) => {
    const text = $(el).text()
    const imgNumMatch = text.match(/IMAGE\s+(\d+)/i)
    if (!imgNumMatch) return

    const anchor = $(el).find('a[href]').first()
    const rawHref = anchor.attr('href') ?? ''
    const href = unwrapGoogleUrl(rawHref)
    if (!href.includes('drive.google.com')) return

    const altMatch =
      text.match(/[Aa]lt\s+tag\s*:\s*[“‘"']([^”’"']+)[”’"']/) ??
      text.match(/[Aa]lt\s+tag\s*:\s*(.+)$/)
    const altTag = altMatch?.[1]?.trim() ?? ''

    const fileIdMatch = href.match(/\/d\/([\w-]+)/)
    const fileId = fileIdMatch?.[1] ?? ''

    rawImages.push({
      index: parseInt(imgNumMatch[1] ?? '1', 10),
      driveUrl: href,
      fileId,
      altTag,
      paraEl: el,
    })

    $(el).replaceWith(
      `<figure data-img-ph="true" data-index="${imgNumMatch[1]}" data-alt="${altTag.replace(/"/g, '&quot;')}" data-drive="${href}"></figure>`
    )
  })

  $('body img').each((idx, el) => {
    const src = $(el).attr('src') ?? ''
    const altTag = $(el).attr('alt') ?? ''
    const isGDrive =
      src.includes('drive.google.com') ||
      src.includes('googleusercontent.com') ||
      src.includes('lh3.google.com')
    if (isGDrive || src.startsWith('http')) {
      rawImages.push({
        index: rawImages.length + 1,
        driveUrl: src,
        fileId: '',
        altTag,
        paraEl: el,
      })
    }
  })

  async function checkDrivePublic(
    fileId: string,
    rawUrl: string
  ): Promise<boolean> {
    if (!fileId && !rawUrl) return false
    const checkUrl = fileId
      ? `https://drive.google.com/uc?id=${fileId}&export=view`
      : rawUrl
    try {
      const r = await fetch(checkUrl, { method: 'HEAD', redirect: 'follow' })
      return r.ok && !r.url.includes('accounts.google.com')
    } catch {
      return false
    }
  }

  const publicResults = await Promise.all(
    rawImages.map((img) => checkDrivePublic(img.fileId, img.driveUrl))
  )

  const images: ArticleImage[] = rawImages.map((img, i) => ({
    index: img.index,
    altTag: img.altTag,
    isGoogleDrive: img.driveUrl.includes('drive.google.com'),
    isPublic: publicResults[i] ?? false,
  }))

  $('body figure[data-img-ph]').each((i, el) => {
    const isPublic = publicResults[i] ?? false
    $(el).attr('data-public', String(isPublic))
  })

  const articleHtml = buildCleanHtml($)

  const links: ArticleLink[] = []
  const seenUrls = new Set<string>()

  $('body a[href]').each((_idx, el) => {
    const rawHref = $(el).attr('href') ?? ''
    let url = rawHref
    try {
      const parsed = new URL(rawHref)
      if (parsed.hostname === 'www.google.com' && parsed.pathname === '/url') {
        url = parsed.searchParams.get('q') ?? rawHref
      }
    } catch {
      return
    }

    if (!url || seenUrls.has(url)) return
    seenUrls.add(url)

    const domain = getDomain(url)
    links.push({
      text: $(el).text().trim(),
      url,
      domain,
      isProductLink:
        !url.includes('google.com') &&
        !url.includes('docs.google') &&
        url.startsWith('http'),
    })
  })

  const h1Count = $('body h1').length
  const h2Count = $('body h2').length
  const h3Count = $('body h3').length
  const paragraphCount = $('body p').filter(
    (_i, el) => $(el).text().trim().length > 0
  ).length

  const plainText = $('body').text()
  const wordCount = countWords(plainText)
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))

  const formatting: FormattingStats = {
    h1Count,
    h2Count,
    h3Count,
    wordCount,
    paragraphCount,
    readingTimeMinutes,
  }

  return {
    metaTitle,
    metaDescription,
    articleTitle,
    articleHtml,
    images,
    links,
    formatting,
    parsedAt: new Date().toISOString(),
  }
}

function buildCleanHtml($: cheerio.CheerioAPI): string {
  const body = $('body')

  body.find('style, script, meta, link').remove()

  const allowedBlock = new Set([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'ul',
    'ol',
    'table',
    'figure',
  ])
  const parts: string[] = []

  body.find('h1,h2,h3,h4,h5,h6,p,ul,ol,table,figure').each((_i, el) => {
    const tag = (el as DomElem).tagName?.toLowerCase() ?? ''
    if (!allowedBlock.has(tag)) return

    if ($(el).attr('data-meta')) return

    const parent = $(el).parent()
    const parentTag = (parent[0] as DomElem)?.tagName?.toLowerCase() ?? ''
    if (
      parentTag === 'li' ||
      parentTag === 'td' ||
      parentTag === 'th' ||
      parentTag === 'blockquote'
    ) {
      return
    }

    let outerHtml: string
    if (tag === 'figure' && $(el).attr('data-img-ph')) {
      const index = $(el).attr('data-index') ?? ''
      const alt = $(el).attr('data-alt') ?? ''
      const drive = $(el).attr('data-drive') ?? ''
      const pub = $(el).attr('data-public') ?? 'false'
      outerHtml = `<figure class="img-placeholder" data-index="${index}" data-alt="${alt}" data-drive="${drive}" data-public="${pub}"></figure>`
    } else {
      outerHtml = buildElement($, el, tag)
    }

    if (outerHtml.trim()) {
      parts.push(outerHtml)
    }
  })

  return parts.join('\n')
}

function buildElement(
  $: cheerio.CheerioAPI,
  el: AnyDomNode,
  tag: string
): string {
  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const text = $(el).text().trim()
      if (!text) return ''
      return `<${tag}>${escapeHtml(text)}</${tag}>`
    }

    case 'p': {
      const inner = buildInlineContent($, el)
      if (!inner.trim()) return ''
      return `<p>${inner}</p>`
    }

    case 'ul':
    case 'ol': {
      const items = $(el)
        .find('li')
        .toArray()
        .map((li) => {
          const inner = buildInlineContent($, li)
          return inner.trim() ? `  <li>${inner}</li>` : ''
        })
        .filter(Boolean)
      if (!items.length) return ''
      return `<${tag}>\n${items.join('\n')}\n</${tag}>`
    }

    case 'table': {
      const rows = $(el)
        .find('tr')
        .toArray()
        .map((tr) => {
          const cells = $(tr)
            .find('td,th')
            .toArray()
            .map((cell) => {
              const cellTag = ((cell as DomElem).tagName ?? 'td').toLowerCase()
              const inner = buildInlineContent($, cell)
              return `    <${cellTag}>${inner}</${cellTag}>`
            })
            .join('\n')
          return `  <tr>\n${cells}\n  </tr>`
        })
        .join('\n')
      return `<table>\n${rows}\n</table>`
    }

    default:
      return ''
  }
}

function buildInlineContent($: cheerio.CheerioAPI, el: AnyDomNode): string {
  const parts: string[] = []

  $(el)
    .contents()
    .each((_i, node) => {
      if (node.type === 'text') {
        const text = (node as DomText).data ?? ''
        if (text.trim()) parts.push(escapeHtml(text))
        else if (text) parts.push(' ')
      } else if (node.type === 'tag') {
        const tag = ((node as DomElem).tagName ?? '').toLowerCase()
        switch (tag) {
          case 'strong':
          case 'b': {
            const inner = buildInlineContent($, node)
            if (inner.trim()) parts.push(`<strong>${inner}</strong>`)
            break
          }
          case 'em':
          case 'i': {
            const inner = buildInlineContent($, node)
            if (inner.trim()) parts.push(`<em>${inner}</em>`)
            break
          }
          case 'a': {
            let href = $(node).attr('href') ?? ''
            try {
              const parsed = new URL(href)
              if (
                parsed.hostname === 'www.google.com' &&
                parsed.pathname === '/url'
              ) {
                href = parsed.searchParams.get('q') ?? href
              }
            } catch {}
            const inner = buildInlineContent($, node)
            if (inner.trim() && href) {
              parts.push(`<a href="${escapeAttr(href)}">${inner}</a>`)
            } else if (inner.trim()) {
              parts.push(inner)
            }
            break
          }
          case 'img': {
            const src = $(node).attr('src') ?? ''
            const alt = $(node).attr('alt') ?? ''
            parts.push(
              `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`
            )
            break
          }
          case 'br': {
            parts.push('<br />')
            break
          }
          case 'span': {
            const inner = buildInlineContent($, node)
            if (inner) parts.push(inner)
            break
          }
          default: {
            const inner = buildInlineContent($, node)
            if (inner) parts.push(inner)
          }
        }
      }
    })

  return parts.join('')
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
