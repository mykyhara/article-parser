import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArticleQA',
  description:
    'Full-stack test assessment for SEO article quality checker, built with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0">{children}</body>
    </html>
  )
}
