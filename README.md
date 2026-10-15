# pendarqom.ir

Persian (RTL) static website for «کلینیک علمی روانشناسی پندار نیم رخ» — the Qom branch of «گروه سازمان‌های علمی اجتماعی درمانی پندار», a scientific psychology clinic offering in-person, phone, and online services. Live at https://pendarqom.ir.

## Stack

- Astro 7 (static output, zero client framework, vanilla-JS islands)
- Tailwind CSS 4 via @tailwindcss/vite
- Content collections with Zod schemas (workshops, articles, therapists)
- Vazirmatn variable font, self-hosted (no CDN)
- vitest for unit tests

## Hard rules

Persian-only RTL UI, Persian digits, zero third-party runtime requests, and no Jalali conversion code — ISO dates in frontmatter plus human-written Persian `dateDisplay`.

## Documentation

- `docs/dev.md` — local development (Persian)
- `docs/maintenance.md` — content update how-tos (Persian)
- `docs/content-todo.md` — pre-launch content replacement checklist
- `docs/superpowers/specs/2026-10-14-pendar-nim-rokh-website-design.md` — design spec
- `docs/superpowers/plans/2026-10-14-pendar-nim-rokh-website.md` — implementation plan

## Deploy

Every push to `main` builds and publishes automatically via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages with the custom domain `pendarqom.ir`. The launch gate is `npm run build:launch`, which fails while placeholder content remains.
