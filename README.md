# ArticleQA

An SEO article quality checker and WordPress publisher tool for writing teams. Paste a Google Docs URL, get instant quality scores, preview the clean article HTML, and send it to WordPress — all in one flow.

---

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** for styling
- **cheerio** for server-side HTML parsing
- State via React `useState` / `useCallback` — no external state libraries

---

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd article-parser
pnpm install
```

### 2. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> No API keys or environment variables required. The app fetches Google Docs via their public HTML export URL — the document just needs to be shared as "Anyone with the link can view".

---

## How It Works

1. **Parse** — Click "Parse Document", paste a Google Docs URL, and hit Parse. The app calls `GET /api/parse`, which fetches the doc as HTML and extracts: meta title, meta description, article title, clean article HTML, image placeholders with Drive access checks, hyperlinks, and formatting stats.

2. **Quality Check** — The score is computed from 4 rules (25 pts each):
   - Image count within configured min/max, all hosted on Google Drive, all shared publicly
   - Product link count within configured min/max (optional domain filter)
   - All alt tags present and above minimum character length
   - Exactly 1 H1, at least 1 H2

3. **Settings** — Click the gear icon to adjust quality thresholds. Changes are persisted to `localStorage` and reactively recalculate the score without re-fetching.

4. **Edit** — Meta title, description, and article title are inline-editable before upload.

5. **Upload** — Review the full payload in a modal, then confirm. `POST /api/upload` is a mock endpoint that returns a simulated WordPress REST API response. On success, the app resets to a clean empty state.

---

## Linter Checks

```bash
pnpm run lint           # Run all linters (ESLint + TypeScript + stylelint)
pnpm run lint:js        # ESLint only
pnpm run lint:types     # TypeScript type check only
pnpm run lint:styles    # stylelint only
pnpm run format         # Prettier format all files
```

---

## API Routes

| Route         | Method | Description                                        |
| ------------- | ------ | -------------------------------------------------- |
| `/api/parse`  | GET    | Fetches and parses a Google Doc by URL or ID       |
| `/api/upload` | POST   | Mock WordPress upload (returns fake post ID + URL) |

---

## Future Ideas

- **Real WordPress upload** — replace mock endpoint with actual REST API calls
- **Multi-document queue** — batch processing for multiple articles
- **Per-client rule presets** — save named rule configurations per client
- **AI alt tag suggestions** — use a vision model to auto-suggest missing alt tags
- **Reading level analysis** — Flesch-Kincaid score and keyword density checks
