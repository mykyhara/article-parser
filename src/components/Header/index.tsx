'use client'
type HeaderProps = {
  parsedAt: Date | null
  onOpenParse: () => void
  onReParse: () => void
  onOpenSettings: () => void
  docId: string
  isLoading: boolean
  hasArticle: boolean
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins === 1) return '1 min ago'
  if (diffMins < 60) return `${diffMins} mins ago`
  const diffHours = Math.floor(diffMins / 60)
  return `${diffHours}h ago`
}

export function Header({
  parsedAt,
  onOpenParse,
  onReParse,
  onOpenSettings,
  docId,
  isLoading,
  hasArticle,
}: HeaderProps) {
  const docUrl = docId
    ? `https://docs.google.com/document/d/${docId}/edit`
    : null

  return (
    <header className="h-[54px] bg-slate-900 flex items-center px-[22px] gap-[14px] sticky top-0 z-30 border-b border-white/[0.07] shrink-0">
      <div className="flex items-center gap-[9px] shrink-0">
        <div className="w-[28px] h-[28px] rounded-[7px] bg-green-500 flex items-center justify-center shadow-[0_1px_6px_rgba(34,197,94,0.45)]">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="text-[15px] font-bold text-slate-50 tracking-[-0.01em]">
          ArticleQA
        </span>
      </div>

      <div className="w-px h-[22px] bg-white/10 shrink-0" />

      {docUrl && hasArticle && (
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[7px] bg-white/[0.07] border border-white/10 text-slate-300 text-[12px] font-medium cursor-pointer no-underline shrink-0 transition-[background] duration-150 whitespace-nowrap"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          View Source Doc
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}

      <span className="text-[12px] text-slate-400/75 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {isLoading
          ? '⟳ Parsing…'
          : parsedAt
            ? `Last parsed: ${formatTimeAgo(parsedAt)}`
            : 'No document loaded — click "Parse Document" to start'}
      </span>

      <div className="flex items-center gap-[8px] shrink-0">
        <button
          onClick={onOpenSettings}
          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center bg-white/[0.07] border border-white/10 text-slate-400 cursor-pointer transition-all duration-150"
          aria-label="Open settings"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {hasArticle && (
          <button
            onClick={onReParse}
            disabled={isLoading}
            className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-white/[0.07] border border-white/[0.12] text-slate-200 text-[12px] font-medium transition-all duration-150 ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isLoading ? 'spin' : ''}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {isLoading ? 'Parsing…' : 'Re-parse'}
          </button>
        )}

        <button
          onClick={onOpenParse}
          disabled={isLoading}
          className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-[8px] bg-green-500 border-none text-white text-[12px] font-semibold transition-all duration-150 shadow-[0_1px_6px_rgba(34,197,94,0.35)] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {hasArticle ? 'Parse New Doc' : 'Parse Document'}
        </button>
      </div>
    </header>
  )
}
