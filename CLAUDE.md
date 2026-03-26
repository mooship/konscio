# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Laterite ("The Red Soil") is a static Astro publication site for eco-socialist and decolonial analysis. Code is MIT-licensed; content is CC0.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
npm run check        # TypeScript/Astro type checking
npm run test         # Run all tests (vitest --run)
npm run format       # Prettier (src/ + package.json)
npm run lint         # ESLint with auto-fix (src/ + scripts/)
npm run link-check   # Validate external links
```

Git hooks (via lefthook) run automatically on `git commit`: Prettier formats and ESLint auto-fixes staged files, then re-stages them. To install hooks after cloning: `npx lefthook install`.

Run a single test file:

```bash
npx vitest run tests/utils/slugify.test.ts
```

## Safety

- **Never deploy to production without explicit permission from the user.** Always ask first and wait for confirmation.

## Architecture

### Content Flow

1. Articles are Markdown/MDX files in `src/content/dispatches/`
2. Frontmatter is validated against the Zod schema in `src/schemas/dispatches.ts`
3. The collection is defined in `src/content.config.ts`
4. Pages use `getStaticPaths()` with `import.meta.glob()` to generate all routes
5. Feeds (RSS `/rss.xml`, Atom `/atom.xml`, JSON Feed `/feed.json`) and search index (`/search.json`) are generated from the same collection. Shared post-processing logic lives in `src/utils/feed.ts`

### Article Frontmatter

Required fields: `title`, `datePublished`, `excerpt`, `categories`, `tags`

Optional: `description`, `dateModified`, `author` (defaults to "Anonymous"), `image`, `draft` (defaults to false)

Draft posts and future-dated posts are excluded from all listings automatically. Reading time (`minutesRead`) is injected by the custom remark plugin in `plugins/remark-reading-time.ts`.

### Layout Hierarchy

`Layout.astro` is the single root layout (in `src/components/`, not a `layouts/` directory). It wraps `Header`, an optional `Sidebar` (toggle via `showSidebar` prop), and `Footer`. The sidebar renders `RecentPosts` and `Categories`.

### Routing

- `/dispatches/[...slug]` — dynamic catch-all for article URLs
- `/categories/[category]` — per-category listing pages
- `/feeds` — feed format picker (RSS, Atom, JSON Feed)
- Slug is derived from the filename (without extension) via `src/utils/slugify.ts`

### Styling

CSS is split across `src/styles/` and imported via `global.css`. Design tokens are CSS custom properties in `variables.css` — always use these rather than hard-coded values. Dark mode is handled via `prefers-color-scheme: dark`. The baseline grid unit is `--grid-unit` (8px). Three variable fonts are loaded via Astro's Font API (`fontProviders.fontsource()`): Oswald (headings), Work Sans (body), JetBrains Mono (code/metadata). CSS variables `--font-oswald`, `--font-work-sans`, `--font-jetbrains-mono` are injected by Astro and referenced via the semantic aliases in `variables.css`.

### SEO

Structured data (JSON-LD), Open Graph, and Twitter card tags are all in `src/components/SEO.astro`. There is no external SEO library — the `<script type="application/ld+json">` is rendered natively using Astro's `set:html`.

### Tests

Tests live in `tests/utils/` and cover utility functions only (no component tests). Vitest runs in a jsdom environment. The config is in `vitest.config.ts`.

### Site Config

Central config (site URL, author, social links) lives in `src/config.ts` and is imported across pages and components.

## Code style

- **No inline comments** — never use trailing `//` comments on the same line as code. JSDoc block comments (`/** */`) are fine where genuinely useful.
- Prettier enforces: double quotes, semicolons, 100-char width
- ESLint uses flat config with TypeScript, Astro, Unicorn, and Prettier integration
