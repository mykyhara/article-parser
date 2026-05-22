import { NextRequest, NextResponse } from 'next/server'
import { parseGoogleDoc } from '@/lib/docParser'

/** Extract a Google Doc ID from either a raw ID string or a full Google Docs URL. */
function extractDocId(raw: string): string | null {
  if (/^[\w-]{25,}$/.test(raw)) return raw

  const match = raw.match(/\/document\/d\/([\w-]+)/)
  return match?.[1] ?? null
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const rawDocId =
    searchParams.get('docId') ?? process.env['GOOGLE_DOC_ID'] ?? ''

  const docId = extractDocId(rawDocId)

  if (!docId) {
    return NextResponse.json(
      {
        message:
          'No document ID provided. Pass ?docId=YOUR_DOC_ID or set GOOGLE_DOC_ID in .env.local.',
      },
      { status: 400 }
    )
  }

  try {
    const article = await parseGoogleDoc(docId)
    return NextResponse.json(article)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to parse document'
    return NextResponse.json({ message }, { status: 502 })
  }
}
