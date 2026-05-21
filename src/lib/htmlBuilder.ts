type TextRun = {
  content?: string
  textStyle?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    link?: { url?: string }
  }
}

type ParagraphElement = {
  textRun?: TextRun
  inlineObjectElement?: {
    inlineObjectId?: string
  }
}

type Paragraph = {
  paragraphStyle?: { namedStyleType?: string }
  bullet?: { listId?: string; nestingLevel?: number }
  elements?: ParagraphElement[]
}

type TableCell = {
  content?: StructuralElement[]
}

type TableRow = {
  tableCells?: TableCell[]
}

type Table = {
  tableRows?: TableRow[]
}

export type StructuralElement = {
  paragraph?: Paragraph
  table?: Table
  sectionBreak?: unknown
}

type InlineObjectProperties = {
  embeddedObject?: {
    imageProperties?: { contentUri?: string; sourceUri?: string }
    title?: string
    description?: string
  }
}

type InlineObjects = Record<
  string,
  { inlineObjectProperties?: InlineObjectProperties }
>

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderTextRun(run: TextRun): string {
  const text = run.content ?? ''
  if (text === '\n') return ''
  const escaped = escapeHtml(text)
  const style = run.textStyle ?? {}

  let result = escaped
  if (style.bold) result = `<strong>${result}</strong>`
  if (style.italic) result = `<em>${result}</em>`
  if (style.underline && !style.link) result = `<u>${result}</u>`
  if (style.link?.url) {
    result = `<a href="${escapeHtml(style.link.url)}" target="_blank" rel="noopener noreferrer">${result}</a>`
  }
  return result
}

function renderParagraphElements(
  elements: ParagraphElement[],
  inlineObjects: InlineObjects
): string {
  return elements
    .map((el) => {
      if (el.textRun) return renderTextRun(el.textRun)
      if (el.inlineObjectElement?.inlineObjectId) {
        const id = el.inlineObjectElement.inlineObjectId
        const obj = inlineObjects[id]
        const imgProps =
          obj?.inlineObjectProperties?.embeddedObject?.imageProperties
        const src = imgProps?.sourceUri ?? imgProps?.contentUri ?? ''
        const alt =
          obj?.inlineObjectProperties?.embeddedObject?.description ?? ''
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`
      }
      return ''
    })
    .join('')
}

function renderTable(table: Table, inlineObjects: InlineObjects): string {
  const rows = (table.tableRows ?? [])
    .map((row) => {
      const cells = (row.tableCells ?? [])
        .map((cell) => {
          const content = buildHtml(cell.content ?? [], inlineObjects)
          return `<td>${content}</td>`
        })
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')
  return `<table>${rows}</table>`
}

export function buildHtml(
  elements: StructuralElement[],
  inlineObjects: InlineObjects = {}
): string {
  const parts: string[] = []
  const listStack: Array<{ tag: string; listId: string }> = []

  function closeLists() {
    while (listStack.length > 0) {
      const item = listStack.pop()
      if (item) parts.push(`</${item.tag}>`)
    }
  }

  for (const element of elements) {
    if (element.table) {
      closeLists()
      parts.push(renderTable(element.table, inlineObjects))
      continue
    }

    if (!element.paragraph) continue
    const para = element.paragraph
    const style = para.paragraphStyle?.namedStyleType ?? 'NORMAL_TEXT'
    const inner = renderParagraphElements(
      para.elements ?? [],
      inlineObjects
    ).trim()

    if (para.bullet) {
      const listId = para.bullet.listId ?? ''
      const tag = 'ul'
      if (
        listStack.length === 0 ||
        listStack[listStack.length - 1]?.listId !== listId
      ) {
        closeLists()
        parts.push(`<${tag}>`)
        listStack.push({ tag, listId })
      }
      parts.push(`<li>${inner}</li>`)
      continue
    }

    closeLists()

    if (!inner) continue

    switch (style) {
      case 'HEADING_1':
        parts.push(`<h1>${inner}</h1>`)
        break
      case 'HEADING_2':
        parts.push(`<h2>${inner}</h2>`)
        break
      case 'HEADING_3':
        parts.push(`<h3>${inner}</h3>`)
        break
      case 'HEADING_4':
        parts.push(`<h4>${inner}</h4>`)
        break
      case 'HEADING_5':
        parts.push(`<h5>${inner}</h5>`)
        break
      case 'HEADING_6':
        parts.push(`<h6>${inner}</h6>`)
        break
      default:
        parts.push(`<p>${inner}</p>`)
    }
  }

  closeLists()
  return parts.join('\n')
}
