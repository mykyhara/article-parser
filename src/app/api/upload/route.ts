import { NextResponse } from 'next/server'
import type { UploadPayload, UploadResponse } from '@/types'

export async function POST(request: Request): Promise<Response> {
  let payload: unknown
  try {
    payload = (await request.json()) as unknown
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const body = payload as Partial<UploadPayload>

  if (!body.metaTitle || !body.articleTitle || !body.articleHtml) {
    return NextResponse.json(
      {
        message:
          'Missing required fields: metaTitle, articleTitle, articleHtml',
      },
      { status: 400 }
    )
  }

  const mockPostId = Math.floor(Math.random() * 90000) + 10000
  const slug = body.articleTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const response: UploadResponse = {
    success: true,
    wordpressPostId: mockPostId,
    postUrl: `https://example.com/${slug}-${mockPostId}`,
    publishedAt: new Date().toISOString(),
    message: `Post "${body.articleTitle}" published successfully (mock).`,
  }

  return NextResponse.json(response)
}
