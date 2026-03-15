# The Red Soil

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/medium.svg)](https://astro.build)

For people and planet: eco-socialist analysis from Africa and the Global South.

An Astro-powered publication exploring capitalism, colonialism, and climate collapse through a decolonial, eco-socialist lens.

## Features

- Eco-socialist analysis of capitalism, colonialism, and climate systems
- Decolonial perspective rooted in Africa and the Global South
- Markdown and MDX content support
- Reading time estimates and table of contents support
- Responsive layout with accessibility-focused markup
- SEO metadata support and RSS generation
- Built-in search with JSON index
- Category pages for content organization

## Tech Stack

- Framework: [Astro](https://astro.build) with MDX integration
- Language: TypeScript
- Styling: Scoped CSS with CSS variables
- Fonts: self-hosted via @fontsource (Oswald, Work Sans, JetBrains Mono)
- Icons: Remixicon
- Build tools: Fontaine for font metric optimization

## Getting Started

Prerequisites: Node.js 22.21.1 or higher, Git.

```bash
git clone https://github.com/theredsoil/konscio.git
cd konscio
npm install
npm run dev
```

Local dev server: `http://localhost:4321`

## Configuration

Site configuration lives in `src/config.ts`.

## Writing Content

Create dispatches as Markdown or MDX files in `src/content/dispatches/`.

```markdown
---
title: "Your Article Title"
datePublished: "YYYY-MM-DD"
description: "Brief SEO description"
author: "Your Name"
excerpt: "Short summary for listings"
categories: ["Category1", "Category2"]
tags: ["tag1", "tag2"]
image: "/images/your-open-graph-image.webp"
---
```

For editorial and submission standards, read `EDITORIAL_GUIDELINES.md`.

## Commands

All commands are run from the project root.

| Command           | Action                                     |
| ----------------- | ------------------------------------------ |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start local dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`         |
| `npm run preview` | Preview local production build             |
| `npm run check`   | Check TypeScript types                     |
| `npm run format`  | Format code with Prettier                  |
| `npm run test`    | Run tests with Vitest                      |

## Deployment

Build the site and deploy the `dist/` folder to any static hosting service.

## Contributing

Contributions are welcome for both code and content.

- Add posts in `src/content/dispatches/` with the required frontmatter
- Run `npm run check` and `npm run test` before opening a pull request
- Follow commit prefixes: `Add:`, `Fix:`, `Update:`, `Remove:`, `Docs:`
- Follow the editorial standards in `EDITORIAL_GUIDELINES.md`

## License

This project is dual licensed.

- Code: [MIT License](LICENSES/MIT.txt)
- Content: [CC0 1.0 Universal](LICENSES/CC0-1.0.txt)

See [LICENCE](LICENCE) for full details and SPDX identifiers.

## Acknowledgments

- Built with [Astro](https://astro.build)
- Icons by [Remixicon](https://remixicon.com/)
- Fonts by [Fontsource](https://fontsource.org/)
- Theme base: [Volks-Typo](https://github.com/jdrhyne/volks-typo)
