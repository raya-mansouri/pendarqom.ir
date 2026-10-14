# کلینیک پندار نیم رخ — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Persian (RTL) static website for کلینیک علمی روانشناسی پندار نیم رخ and deploy it to GitHub Pages at https://pendarqom.ir.

**Architecture:** Astro 7 static output (zero client framework, vanilla JS islands ≤15KB), Tailwind CSS 4 via `@tailwindcss/vite`, Zod-validated content collections (Markdown per therapist/service/workshop/article), a `site.ts` single source of truth for contact data, GitHub Actions deploy on push to `main`.

**Tech Stack:** astro@^7.3.8, tailwindcss@^4.3, @tailwindcss/vite, @fontsource-variable/vazirmatn, @astrojs/sitemap, @astrojs/check + typescript, vitest (unit tests only), Node ≥ 22.12 (local machine has v26 ✓).

**Spec:** `docs/superpowers/specs/2026-10-14-pendar-nim-rokh-website-design.md` — the plan implements that spec; executors read both. External facts in this plan (GitHub Pages IPs, action versions, Astro APIs, package versions) were verified against primary sources on 2026-10-14.

## Global Constraints

- **Language/RTL:** Persian only. Every page: `<html lang="fa" dir="rtl">`. Use CSS logical properties (Tailwind `ms-/me-/ps-/pe-/start-/end-`). No LTR content anywhere except technical `tel:`/`wa.me` href values.
- **Numerals:** Persian digits (۰-۹) for all user-visible numbers via `toPersianDigits()`. Latin digits ONLY inside `tel:` / `wa.me` hrefs.
- **Dates:** NO Jalali conversion code anywhere. Dated content carries both `startDate`/`publishDate` (ISO, for sorting/JSON-LD) and `dateDisplay` (human-written Persian string, e.g. «جمعه ۲۸ فروردین ۱۴۰۴»). Rationale: avoids conversion bugs and a dependency; the clinic writes dates themselves.
- **Zero third-party runtime requests.** All assets self-hosted (fonts via @fontsource, images local). No CDN links, no analytics, no external iframes (map = deep links only).
- **Placeholders:** every not-yet-real item carries `placeholder: true` (collections/data) or `draft: true` (articles). Placeholders render normally in dev/preview but `npm run build:launch` must fail while any remain (Task 16).
- **Performance budgets (spec §10):** Lighthouse mobile Perf ≥ 95 / A11y → 100 / SEO ≥ 95 / BP ≥ 95; first view ≤ 400KB; JS ≤ 15KB gz; CSS ≤ 50KB gz; fonts ≤ 150KB; hero image ≤ 150KB; LCP ≤ 2.0s; CLS ≤ 0.05.
- **Accessibility:** WCAG 2.1 AA — skip link, landmarks, focus-visible rings, keyboard-operable drawer/lightbox/accordion, `prefers-reduced-motion` respected, alt text mandatory.
- **JS budget:** vanilla TS only. No React/Vue/alpine. Libraries: NONE at runtime.
- **Design tokens** are defined once in `src/styles/global.css` (Tailwind 4 `@theme`) and consumed as utilities everywhere. Never hardcode hex values in components.
- **Commits:** conventional commits (`feat:`, `chore:`, `docs:`, `test:`), one commit per task step where marked. (Owner confirmed plan-driven commits; they handle docs/remote setup themselves.)
- **Placeholder images are SVG** in `src/assets/` (local, tiny, no external placeholder services). Use plain `<img>` with explicit `width`/`height` for them (astro:assets `<Image>` is for future raster photos — documented in maintenance.md). When real photos arrive, switch to `<Image>`.
- **Do not add features beyond the spec** (no newsletter, no analytics, no dark mode, no English). If a task seems to need one, stop and ask the owner.
- **UI quality skills:** executors should consult `persian-rtl-ui` and `impeccable` skills when building visual components; `superpowers:verification-before-completion` before claiming any task done.

## Verified External Facts (2026-10-14)

| Fact | Value | Source |
|---|---|---|
| astro latest | 7.3.8, requires Node ≥22.12 | npm registry / Astro docs |
| Content collections API | `src/content.config.ts`, `glob` from `astro/loaders`, `z` from `astro/zod`, `render(entry)` from `astro:content`, route param uses `entry.id` | Astro docs (Context7) |
| Tailwind in Astro | `@tailwindcss/vite` plugin (integration deprecated) | Astro docs |
| GH Pages A records | 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153 | live DNS of raya-mansouri.github.io |
| GH Pages AAAA records | 2606:50c0:8000::153 … 2606:50c0:8003::153 | live DNS |
| Deploy actions | actions/checkout@v7, withastro/action@v6, actions/deploy-pages@v5 | Astro deploy docs |
| Packages exist | @fontsource-variable/vazirmatn@5.3.0, @astrojs/sitemap@3.7.4, @astrojs/check@0.9.10, vitest@5.0.4 | npm registry |
| Repo | github.com/raya-mansouri/pendarqom.ir (public) | HTTP 200 |

---

### Task 1: Project scaffold & toolchain

**Files:**
- Create: `package.json`, `.gitignore`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro`, `public/favicon.svg`
- Create: `.env.example`? NO — no env vars in this project (static site).

**Interfaces:**
- Produces: runnable `npm run dev` / `npm run build` / `npm run check`; `global.css` imported by every page later; `site` const in `astro.config.mjs` = `https://pendarqom.ir`.

- [ ] **Step 1: Verify repo state**

Run: `git -C /Users/raya/Documents/pendarqom.ir status --short && git -C /Users/raya/Documents/pendarqom.ir remote -v && node --version`
Expected: repo exists; owner has committed docs and added remote `origin git@github.com:raya-mansouri/pendarqom.ir` (or https). Node ≥ 22.12. If remote missing or docs uncommitted, ASK the owner — do not commit their pending work.

- [ ] **Step 2: Create `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
.DS_Store
*.log
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "pendarqom.ir",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "build:launch": "node scripts/check-placeholders.mjs && astro build"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.10",
    "@astrojs/sitemap": "^3.7.4",
    "@fontsource-variable/vazirmatn": "^5.3.0",
    "@tailwindcss/vite": "^4.3.3",
    "astro": "^7.3.8",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.6.0"
  },
  "devDependencies": {
    "vitest": "^5.0.4"
  }
}
```

- [ ] **Step 4: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://pendarqom.ir",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Create minimal `src/styles/global.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 7: Create minimal `src/pages/index.astro`**

```astro
---
import "../styles/global.css";
---
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>کلینیک علمی روانشناسی پندار نیم رخ</title>
  </head>
  <body>
    <p>سایت در حال ساخت است</p>
  </body>
</html>
```

- [ ] **Step 8: Create placeholder `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#3C6B5E"/>
  <text x="32" y="44" font-family="Tahoma, sans-serif" font-size="34" font-weight="bold" fill="#FAF8F4" text-anchor="middle">پ</text>
</svg>
```

- [ ] **Step 9: Install and verify**

Run: `npm install && npm run build && npm run check`
Expected: build succeeds, `dist/index.html` exists, `astro check` reports 0 errors.
If `@tailwindcss/vite` has a peer-dependency conflict with Astro 7's Vite 8: STOP and ask the owner before pinning any downgrade — do not resolve silently.

Run: `npm run dev` in background, then `curl -s http://localhost:4321/ | head -5`
Expected: HTML starting with `<!doctype html>`. Stop the dev server.

- [ ] **Step 10: Commit**

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css src/pages/index.astro public/favicon.svg
git commit -m "chore: scaffold Astro 7 + Tailwind 4 project"
```

---

### Task 2: Design tokens, fonts, shared styles

**Files:**
- Modify: `src/styles/global.css` (full replacement)
- Verify: `node_modules/@fontsource-variable/vazirmatn/index.css` (READ ONLY — to confirm the exact CSS font-family name; do not edit node_modules)

**Interfaces:**
- Produces: theme tokens usable as Tailwind utilities — `bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`, `bg-primary-{50..900}`, `text-clay`, `shadow-soft` — and component classes `.container-site`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-whatsapp`, `.btn-call`, `.card`, `.badge`, `.section`, `.eyebrow`, `.reveal`, `.prose-fa`. Later tasks consume ONLY these.

- [ ] **Step 1: Confirm the fontsource font-family name**

Run: `grep -m1 "font-family" node_modules/@fontsource-variable/vazirmatn/index.css`
Expected: `font-family: 'Vazirmatn Variable';` — if the name differs, use the actual value in `--font-sans` below.

- [ ] **Step 2: Replace `src/styles/global.css`**

```css
@import "tailwindcss";
@import "@fontsource-variable/vazirmatn";

@theme {
  --font-sans: "Vazirmatn Variable", "Segoe UI", Tahoma, system-ui, sans-serif;

  --color-bg: #faf8f4;
  --color-surface: #ffffff;
  --color-ink: #22302b;
  --color-ink-muted: #5c6b64;

  --color-primary-50: #f0f6f3;
  --color-primary-100: #dceae4;
  --color-primary-200: #bbd6cc;
  --color-primary-300: #93bcae;
  --color-primary-400: #6b9e8d;
  --color-primary-500: #4e8474;
  --color-primary-600: #3c6b5e;
  --color-primary-700: #2f564c;
  --color-primary-800: #264741;
  --color-primary-900: #1f3a35;

  --color-clay: #8c5a3c;
  --color-status-open: #2e7d4f;
  --color-status-open-bg: #e6f4ec;
  --color-status-full: #9a6b1f;
  --color-status-full-bg: #fbf3e0;
  --color-status-past: #5c6b64;
  --color-status-past-bg: #eef1ef;

  --shadow-soft: 0 10px 30px rgb(34 48 43 / 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-bg font-sans text-ink antialiased;
  font-size: 1.0625rem;
  line-height: 1.9;
}

h1, h2, h3, h4 {
  @apply font-bold;
  line-height: 1.4;
  text-wrap: balance;
}

:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@layer components {
  .container-site {
    @apply mx-auto w-full max-w-6xl px-4 sm:px-6;
  }
  .section {
    @apply py-16 sm:py-24;
  }
  .eyebrow {
    @apply text-sm font-semibold text-primary-600;
  }
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors;
  }
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  .btn-secondary {
    @apply border border-primary-200 bg-surface text-primary-700 hover:bg-primary-50;
  }
  .btn-ghost {
    @apply text-primary-700 hover:bg-primary-50;
  }
  .btn-whatsapp {
    @apply bg-[#1fa855] text-white hover:bg-[#178a44];
  }
  .btn-call {
    @apply bg-ink text-white hover:bg-primary-900;
  }
  .card {
    @apply rounded-2xl bg-surface shadow-soft;
  }
  .badge {
    @apply inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold;
  }
  .prose-fa {
    @apply max-w-[70ch];
  }
  .prose-fa h2 {
    @apply mt-10 mb-4 text-2xl;
  }
  .prose-fa h3 {
    @apply mt-8 mb-3 text-xl;
  }
  .prose-fa p {
    @apply mb-4;
  }
  .prose-fa ul {
    @apply mb-4 list-disc space-y-2 ps-6;
  }
  .prose-fa a {
    @apply text-primary-600 underline underline-offset-4 hover:text-primary-700;
  }
  .prose-fa blockquote {
    @apply my-6 border-s-4 border-primary-300 bg-primary-50 px-5 py-3 text-ink-muted;
  }
}

/* Scroll-reveal (JS adds .is-visible; disabled for reduced-motion users via media query above) */
.reveal {
  opacity: 0;
  translate: 0 16px;
  transition: opacity 0.45s ease-out, translate 0.45s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  translate: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; translate: none; }
}
```

- [ ] **Step 3: Verify build and tokens emit**

Run: `npm run build && grep -o "Vazirmatn Variable" dist/_astro/*.css | head -1 && grep -c "primary-600\|#3c6b5e" dist/_astro/*.css`
Expected: build passes; font name present; token color present in emitted CSS.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: design tokens, Vazirmatn self-hosted font, shared component classes"
```

---

### Task 3: Utility functions with TDD (vitest)

**Files:**
- Test: `src/utils/persian.test.ts`, `src/utils/links.test.ts`, `src/utils/readingtime.test.ts`
- Create: `src/utils/persian.ts`, `src/utils/links.ts`, `src/utils/readingtime.ts`

**Interfaces:**
- Produces (consumed by Tasks 7, 12, and all pages):
  - `toPersianDigits(input: string | number): string`
  - `telHref(raw: string): string`
  - `whatsappLink(number: string, message?: string): string`
  - `workshopSignupMessage(title: string): string`
  - `readingTimeMinutes(text: string): number`

- [ ] **Step 1: Write failing tests — `src/utils/persian.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { toPersianDigits } from "./persian";

describe("toPersianDigits", () => {
  it("converts Latin digits to Persian", () => {
    expect(toPersianDigits("1404")).toBe("۱۴۰۴");
  });
  it("converts numbers", () => {
    expect(toPersianDigits(12)).toBe("۱۲");
  });
  it("leaves non-digit characters untouched", () => {
    expect(toPersianDigits("session 3 of 8")).toBe("session ۳ of ۸");
  });
  it("handles empty string", () => {
    expect(toPersianDigits("")).toBe("");
  });
});
```

- [ ] **Step 2: Write failing tests — `src/utils/links.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { telHref, whatsappLink, workshopSignupMessage } from "./links";

describe("telHref", () => {
  it("strips spaces and dashes, keeps +", () => {
    expect(telHref("+98 25-3xxx")).toBe("tel:+98253xxx");
  });
});

describe("whatsappLink", () => {
  it("builds wa.me url from intl number", () => {
    expect(whatsappLink("+98 912 345 6789")).toBe("https://wa.me/989123456789");
  });
  it("appends encoded message", () => {
    const url = whatsappLink("989123456789", "سلام");
    expect(url).toBe(`https://wa.me/989123456789?text=${encodeURIComponent("سلام")}`);
  });
});

describe("workshopSignupMessage", () => {
  it("includes the workshop title", () => {
    expect(workshopSignupMessage("مهارت‌های فرزندپروری")).toContain("مهارت‌های فرزندپروری");
    expect(workshopSignupMessage("x")).toMatch(/^سلام/);
  });
});
```

- [ ] **Step 3: Write failing tests — `src/utils/readingtime.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { readingTimeMinutes } from "./readingtime";

describe("readingTimeMinutes", () => {
  it("returns at least 1 minute", () => {
    expect(readingTimeMinutes("سلام")).toBe(1);
  });
  it("scales with word count at ~200 wpm", () => {
    const text = Array(400).fill("کلمه").join(" ");
    expect(readingTimeMinutes(text)).toBe(2);
  });
  it("ignores whitespace-only text", () => {
    expect(readingTimeMinutes("   ")).toBe(1);
  });
});
```

- [ ] **Step 4: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — modules `./persian`, `./links`, `./readingtime` not found.

- [ ] **Step 5: Implement `src/utils/persian.ts`**

```ts
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}
```

- [ ] **Step 6: Implement `src/utils/links.ts`**

```ts
export function telHref(raw: string): string {
  return `tel:${raw.replace(/[^+\d]/g, "")}`;
}

export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function workshopSignupMessage(title: string): string {
  return `سلام، برای ثبت‌نام کارگاه «${title}» راهنمایی می‌خواستم.`;
}
```

- [ ] **Step 7: Implement `src/utils/readingtime.ts`**

```ts
export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
```

- [ ] **Step 8: Run tests, verify they pass**

Run: `npm test`
Expected: all PASS (9 tests).

- [ ] **Step 9: Commit**

```bash
git add src/utils/
git commit -m "feat: persian digits, contact link builders, reading time (TDD)"
```

---

### Task 4: Site data (single source of truth)

**Files:**
- Create: `src/data/site.ts`, `src/data/testimonials.ts`, `src/data/faq.ts`

**Interfaces:**
- Produces `site` (consumed by Header, Footer, CtaStrip, ContactChannels, HoursTable, contact page, JSON-LD): typed const with `name, shortName, tagline, url, phones[], whatsapp?, instagram?, telegram?, eitea?, bale?, address, maps{neshan,balad,google}, hours[], licenses[], crisisLines[], foundedYear`.
- Produces `testimonials` (home page): `{ quote, attribution, consent, placeholder }[]` — ONLY entries with `consent: true` may ever render.
- Produces `faqs` (faq page): `{ question, answer, category, order }[]`.
- Social/channel fields are optional (`?`) — components render a channel ONLY when defined (spec §6.2).

- [ ] **Step 1: Create `src/data/site.ts`**

```ts
export const site = {
  name: "کلینیک علمی روانشناسی پندار نیم رخ",
  shortName: "پندار نیم رخ",
  tagline: "سلامت روان، با روش علمی و در فضایی آرام",
  url: "https://pendarqom.ir",
  phones: [
    { label: "تماس با کلینیک", number: "025 0000 0000" },
  ],
  whatsapp: "989000000000",
  instagram: "https://instagram.com/pendarnimrokh",
  telegram: "https://t.me/pendarnimrokh",
  eitea: "https://eitaa.com/pendarnimrokh",
  bale: "https://ble.ir/pendarnimrokh",
  address: "قم، [نشانی دقیق کلینیک — به‌زودی]",
  maps: {
    neshan: "https://neshan.org/maps/@35.7,50.0,15z",
    balad: "https://balad.ir/location?q=قم",
    google: "https://www.google.com/maps/search/?api=1&query=pendarqom",
  },
  hours: [
    { days: "شنبه تا چهارشنبه", time: "۱۶:۰۰ تا ۲۱:۰۰" },
    { days: "پنجشنبه", time: "۹:۰۰ تا ۱۳:۰۰" },
    { days: "جمعه", time: "تعطیل" },
  ],
  licenses: [
    { org: "سازمان نظام روانشناسی و مشاوره", number: "پروانه شماره ۰۰۰۰۰۰ (نمونه)" },
  ],
  crisisLines: [
    { label: "صدای مشاور", number: "1480" },
    { label: "اورژانس اجتماعی", number: "123" },
  ],
  foundedYear: 1404,
} as const;

export type SiteConfig = typeof site;
```

(Latin digits above are deliberate: `phones[].number` and `crisisLines[].number` feed `telHref()`, which must produce dialable `tel:` hrefs — Persian digits would be stripped and break the link. Components display all numbers via `toPersianDigits()`.)

- [ ] **Step 2: Create `src/data/testimonials.ts`**

```ts
export interface Testimonial {
  quote: string;
  attribution: string;
  consent: boolean;
  placeholder: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote: "فضای کلینیک خیلی آرام بود و از اولین جلسه احساس امنیت کردم.",
    attribution: "م.، مراجع فردی",
    consent: true,
    placeholder: true,
  },
  {
    quote: "کارگاه فرزندپروری واقعاً نگاه ما را به رفتار فرزندمان عوض کرد.",
    attribution: "ر. و س.، والدین",
    consent: true,
    placeholder: true,
  },
  {
    quote: "رویارو شدن با مشکلمون به‌عنوان زوج، با کمک درمانگر خیلی محترمانه پیش رفت.",
    attribution: "ک.، مراجع زوج‌درمانی",
    consent: true,
    placeholder: true,
  },
];
```

- [ ] **Step 3: Create `src/data/faq.ts`**

```ts
export interface Faq {
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const faqs: Faq[] = [
  {
    question: "چطور نوبت جلسه رزرو کنم؟",
    answer: "می‌توانید از طریق تماس تلفنی یا پیام واتساپ نوبت خود را هماهنگ کنید. اطلاعات تماس در صفحه «تماس و نوبتدهی» موجود است.",
    category: "نوبتدهی",
    order: 1,
  },
  {
    question: "هر جلسه چقدر طول می‌کشد؟",
    answer: "جلسات فردی معمولاً ۴۵ تا ۶۰ دقیقه است. مدت دقیق جلسات اولیه در تماس اول مشخص می‌شود.",
    category: "جلسات",
    order: 2,
  },
  {
    question: "هزینه جلسات چقدر است؟",
    answer: "هزینه جلسات بسته به نوع خدمت و درمانگر متفاوت است. برای اطلاع از تعرفه روز، با کلینیک تماس بگیرید.",
    category: "هزینه و بیمه",
    order: 3,
  },
  {
    question: "آیا اطلاعات من محرمانه می‌ماند؟",
    answer: "بله. رازداری حرفه‌ای از اصول بنیادین کار ماست و همه اطلاعات مراجعین محرمانه باقی می‌ماند؛ مگر در موارد استثنایی که قانون تکلیف کرده است.",
    category: "رازداری",
    order: 4,
  },
  {
    question: "اولین جلسه چگونه پیش می‌رود؟",
    answer: "در جلسه اول، درمانگر شما را می‌شناسد، مسئله فعلی را می‌شنود و درباره مسیر درمان با شما هم‌فکری می‌کند. هیچ تعهدی قبل از تصمیم شما وجود ندارد.",
    category: "جلسات",
    order: 5,
  },
  {
    question: "برای کودک و نوجوان هم خدمات دارید؟",
    answer: "بله. ارزیابی و درمان اختصاصی کودکان و نوجوانان از خدمات کلینیک است؛ جزئیات در صفحه «خدمات» بخش کودک و نوجوان.",
    category: "کودکان و نوجوانان",
    order: 6,
  },
  {
    question: "آیا خدمات کلینیک تحت پوشش بیمه است؟",
    answer: "پوشش بیمه‌ای متفاوت است. لطفاً شرایط بیمه خود را با ما در میان بگذارید تا راهنمایی کنیم.",
    category: "هزینه و بیمه",
    order: 7,
  },
  {
    question: "کارگاه‌ها چگونه برگزار می‌شوند؟",
    answer: "کارگاه‌ها به‌صورت حضوری در کلینیک برگزار می‌شوند. ظرفیت و تاریخ هر کارگاه در صفحه «کارگاه‌ها» اعلام می‌شود و ثبت‌نام از طریق واتساپ انجام می‌گیرد.",
    category: "کارگاه‌ها",
    order: 8,
  },
];
```

- [ ] **Step 4: Verify typecheck**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: site config, testimonials, FAQ data (placeholder content)"
```

---

### Task 5: Content collections, schemas, seed content & placeholder assets

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/services/*.md` (6 files), `src/content/therapists/*.md` (4), `src/content/workshops/*.md` (3), `src/content/articles/*.md` (3)
- Create: `src/assets/therapists/*.svg` (4), `src/assets/articles/*.svg` (3), `src/assets/gallery/*.svg` (6)

**Interfaces:**
- Produces collections (consumed by Tasks 9–14): `services, therapists, workshops, articles` via `getCollection()`. Entry URLs derive from `entry.id`. Every entry has `placeholder: boolean`; articles also `draft: boolean` (draft=true → excluded from listing/detail pages).
- Produces asset helpers: `src/utils/assets.ts` exporting `therapistPhotos: Record<string, { src: string }>` and `articleCovers: Record<string, { src: string }>` built with eager `import.meta.glob` (keys = filename without extension, e.g. `dr-sara-mohammadi`).

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const serviceCategories = [
  "فردی",
  "زوج و خانواده",
  "کودک و نوجوان",
  "گروه‌درمانی",
  "ارزیابی و تست",
  "آموزش و کارگاه",
] as const;

const services = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(serviceCategories),
    icon: z.enum(["individual", "couples", "child", "group", "assessment", "workshop"]),
    order: z.number(),
    placeholder: z.boolean(),
  }),
});

const therapists = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/therapists" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    licenseNumber: z.string(),
    specialties: z.array(z.string()),
    approaches: z.array(z.string()),
    education: z.array(z.string()),
    languages: z.array(z.string()).default(["فارسی"]),
    order: z.number(),
    featured: z.boolean().default(false),
    placeholder: z.boolean(),
  }),
});

const workshops = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string(),
    instructor: z.string(),
    startDate: z.coerce.date(),
    dateDisplay: z.string(),
    time: z.string(),
    location: z.string(),
    capacity: z.number().optional(),
    fee: z.string().optional(),
    status: z.enum(["open", "full", "past"]),
    registrationNote: z.string().optional(),
    placeholder: z.boolean(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    dateDisplay: z.string(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    placeholder: z.boolean(),
  }),
});

export const collections = { services, therapists, workshops, articles };
```

- [ ] **Step 2: Create `src/utils/assets.ts`**

```ts
export interface AssetEntry {
  src: string;
}

const therapistModules = import.meta.glob<{ default: { src: string } }>(
  "../assets/therapists/*.svg",
  { eager: true },
);
export const therapistPhotos: Record<string, AssetEntry> = Object.fromEntries(
  Object.entries(therapistModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".svg", ""),
    { src: mod.default.src },
  ]),
);

const articleModules = import.meta.glob<{ default: { src: string } }>(
  "../assets/articles/*.svg",
  { eager: true },
);
export const articleCovers: Record<string, AssetEntry> = Object.fromEntries(
  Object.entries(articleModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".svg", ""),
    { src: mod.default.src },
  ]),
);
```

- [ ] **Step 3: Create placeholder assets** — same pattern for all; vary title text and gradient hue (use primary-600 `#3c6b5e` ↔ primary-300 `#93bcae` and clay `#8c5a3c` alternately).

`src/assets/therapists/dr-sara-mohammadi.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="تصویر نمونه درمانگر">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3c6b5e"/><stop offset="1" stop-color="#93bcae"/>
  </linearGradient></defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <circle cx="300" cy="230" r="90" fill="#faf8f4" opacity="0.9"/>
  <path d="M120 600c0-120 80-180 180-180s180 60 180 180z" fill="#faf8f4" opacity="0.9"/>
  <text x="300" y="60" font-family="Tahoma, sans-serif" font-size="30" fill="#faf8f4" text-anchor="middle">تصویر نمونه — دکتر سارا محمدی</text>
</svg>
```
Repeat for `dr-reza-karimi.svg`, `dr-maryam-ahmadi.svg`, `dr-ali-hosseini.svg` (change the `<text>` label accordingly).

`src/assets/articles/stress-signs.svg`, `child-anxiety.svg`, `couples-communication.svg` (1200×630, same gradient, label «تصویر نمونه مقاله»):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="تصویر نمونه مقاله">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4e8474"/><stop offset="1" stop-color="#f0f6f3"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="330" font-family="Tahoma, sans-serif" font-size="44" fill="#22302b" text-anchor="middle">تصویر نمونه مقاله</text>
</svg>
```

`src/assets/gallery/room-1.svg` … `room-6.svg` (800×600, alternating gradients `#dceae4→#93bcae` and `#fbf3e0→#e7d8b8`, labels «اتاق درمان ۱ (نمونه)» … «فضای انتظار (نمونه)»).

- [ ] **Step 4: Seed services (6 files).** Example — `src/content/services/individual-therapy.md`:

```markdown
---
title: "روان‌درمانی فردی"
summary: "جلسات فردی برای اضطراب، افسردگی، استرس و رشد فردی با رویکردهای مبتنی بر شواهد."
category: "فردی"
icon: "individual"
order: 1
placeholder: true
---

جلسات روان‌درمانی فردی فضایی امن برای بررسی چالش‌های روانی مانند اضطراب، افسردگی و استرس است. درمانگر با رویکردهای علمی و مبتنی بر شواهد، مسیر درمان را متناسب با شما طراحی می‌کند.
```

Create the remaining five (each with `order` 2–6, matching icons, 1–2 sentence bodies):
- `couples-therapy.md` — «زوج‌درمانی» — category «زوج و خانواده», icon `couples`
- `family-therapy.md` — «خانواده‌درمانی» — category «زوج و خانواده», icon `couples`
- `child-adolescent.md` — «روانشناسی کودک و نوجوان» — category «کودک و نوجوان», icon `child`
- `group-therapy.md` — «گروه‌درمانی» — category «گروه‌درمانی», icon `group`
- `assessment.md` — «ارزیابی و تست روانشناختی» — category «ارزیابی و تست», icon `assessment`

- [ ] **Step 5: Seed therapists (4 files).** Example — `src/content/therapists/dr-sara-mohammadi.md`:

```markdown
---
name: "دکتر سارا محمدی"
title: "دکترای روانشناسی بالینی"
licenseNumber: "پروانه نظام روانشناسی ۰۰۰۰۰۰ (نمونه)"
specialties: ["اضطراب", "افسردگی", "اختلالات وسواس"]
approaches: ["CBT", "ACT"]
education: ["دکترای روانشناسی بالینی — دانشگاه نمونه"]
languages: ["فارسی", "انگلیسی"]
order: 1
featured: true
placeholder: true
---

(نمونه) دکتر محمدی بیش از ده سال تجربه درمان فردی بزرگسالان دارد و روی درمان مبتنی بر شواهد تمرکز می‌کند.
```

Create `dr-reza-karimi.md` (زوج‌درمانی و خانواده، EFT، featured), `dr-maryam-ahmadi.md` (کودک و نوجوان، بازی‌درمانی، featured), `dr-ali-hosseini.md` (ارزیابی و تست، گروه‌درمانی، featured: false). All `placeholder: true`, license numbers marked «(نمونه)».

- [ ] **Step 6: Seed workshops (3 files).** Example — `src/content/workshops/parenting-skills.md`:

```markdown
---
title: "کارگاه مهارت‌های فرزندپروری"
instructor: "دکتر سارا محمدی"
startDate: 2026-11-05
dateDisplay: "پنجشنبه ۱۵ آبان ۱۴۰۵"
time: "۱۶:۰۰ تا ۱۹:۰۰"
location: "سالن کلینیک پندار نیم رخ"
capacity: 15
fee: "۱٬۵۰۰٬۰۰۰ تومان"
status: "open"
registrationNote: "ثبت‌نام از طریق واتساپ کلینیک انجام می‌شود."
placeholder: true
---

کارگاهی عملی برای والدین کودک و نوجوان: چگونه مرزهای سالم بگذاریم، با لجبازی کنار بیاییم و رابطه‌ای گرم بسازیم.
```

Create `couples-communication-workshop.md` (status `full`, تاریخ آینده), `intro-cbt-past.md` («آشنایی با درمان شناختی-رفتاری», status `past`, تاریخ گذشته). `startDate` ISO must MATCH `dateDisplay` (double-check year: 2026-11-05 ≈ آبان ۱۴۰۵).

- [ ] **Step 7: Seed articles (3 files).** Example — `src/content/articles/stress-signs.md`:

```markdown
---
title: "۱۰ نشانه استرس که نباید نادیده بگیرید"
description: "نشانه‌های جسمی و روانی استرس و زمان مراجعه به روانشناس."
publishDate: 2026-10-01
dateDisplay: "۱ مهر ۱۴۰۵"
author: "تیم تحریریه پندار نیم رخ"
category: "سلامت روان"
tags: ["استرس", "سلامت روان"]
draft: false
placeholder: true
---

استرس بخشی طبیعی از زندگی است، اما نشانه‌های پایدار آن نباید نادیده گرفته شود...

## نشانه‌های جسمی

- سردردهای مکرر بدون علت جسمی
- اختلال خواب

## چه زمانی به متخصص مراجعه کنیم؟

اگر این نشانه‌ها بیش از چند هفته ادامه یابند...
```

Create `child-anxiety.md` (draft: **true** — demonstrates draft exclusion) and `couples-communication.md` (draft: false). All `placeholder: true`, each with 3+ short paragraphs.

- [ ] **Step 8: Verify schema validation (positive + negative)**

Run: `npm run build`
Expected: build passes (collections registered; nothing consumes them yet).
Negative test: temporarily change `status: "open"` to `status: "draft-open"` in one workshop file, run `npm run build` again.
Expected: FAIL with a Zod error naming the file and field. Revert the change, re-run build → passes.

- [ ] **Step 9: Commit**

```bash
git add src/content.config.ts src/utils/assets.ts src/content/ src/assets/
git commit -m "feat: content collections with Zod schemas + seeded placeholder content"
```

---

### Task 6: BaseLayout, SEO head, JSON-LD

**Files:**
- Create: `src/components/BaseHead.astro`, `src/components/JsonLd.astro`, `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (use BaseLayout)

**Interfaces:**
- Produces `BaseLayout` props: `{ title: string; description: string; ogImage?: string; jsonLd?: object[]; }` — all pages (Tasks 9–15) wrap content in `<BaseLayout …>`.
- Produces `JsonLd` component: `{ data: object }` — renders `<script type="application/ld+json">` with `<` escaped.

- [ ] **Step 1: Create `src/components/JsonLd.astro`**

```astro
---
interface Props {
  data: Record<string, unknown>;
}
const { data } = Astro.props;
const json = JSON.stringify(data).replace(/</g, "\\u003c");
---
<script type="application/ld+json" set:html={json} />
```

- [ ] **Step 2: Create `src/components/BaseHead.astro`**

```astro
---
import { site } from "../data/site";

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
const { title, description, ogImage = "/og-default.png" } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImageAbs = new URL(ogImage, Astro.site);
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<meta name="generator" content={Astro.generator} />
<meta name="theme-color" content="#3c6b5e" />
<link rel="canonical" href={canonical} />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="sitemap" href="/sitemap-index.xml" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content={site.name} />
<meta property="og:locale" content="fa_IR" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImageAbs} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageAbs} />
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import "../styles/global.css";
import BaseHead from "../components/BaseHead.astro";
import JsonLd from "../components/JsonLd.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>[];
}
const { title, description, ogImage, jsonLd = [] } = Astro.props;
---
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <BaseHead title={title} description={description} ogImage={ogImage} />
    {jsonLd.map((data) => <JsonLd data={data} />)}
  </head>
  <body class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
    >
      پرش به محتوای اصلی
    </a>
    <Header />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <Footer />
    <script>
      import "../scripts/menu";
      import "../scripts/reveal";
    </script>
  </body>
</html>
```

Note: this imports `Header`, `Footer`, `scripts/menu`, `scripts/reveal` — created in Task 7. To keep the build green at THIS task's checkpoint, create minimal stubs now (`Header.astro`/`Footer.astro` rendering `<header/>`/`<footer/>` only, and empty `src/scripts/menu.ts`, `src/scripts/reveal.ts` files); Task 7 replaces them with the real implementations.

Stub `src/scripts/menu.ts`:
```ts
export {};
```
Stub `src/scripts/reveal.ts`:
```ts
export {};
```

- [ ] **Step 4: Update `src/pages/index.astro` to use the layout**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="کلینیک علمی روانشناسی پندار نیم رخ" description="سلامت روان، با روش علمی و در فضایی آرام">
  <div class="container-site section">
    <h1>کلینیک علمی روانشناسی پندار نیم رخ</h1>
    <p>سایت در حال ساخت است</p>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Verify head output**

Run: `npm run build && grep -E "canonical|og:title|ld\+json|lang=\"fa\"" dist/index.html`
Expected: canonical `https://pendarqom.ir/`, og:title, `lang="fa" dir="rtl"` present.

- [ ] **Step 6: Commit**

```bash
git add src/components/BaseHead.astro src/components/JsonLd.astro src/layouts/ src/pages/index.astro src/components/Header.astro src/components/Footer.astro src/scripts/
git commit -m "feat: base layout with SEO head, JSON-LD, skip link (header/footer stubs)"
```

---

### Task 7: Header, Footer, menu & reveal scripts

**Files:**
- Modify (replace stubs): `src/components/Header.astro`, `src/components/Footer.astro`, `src/scripts/menu.ts`, `src/scripts/reveal.ts`
- Create: `src/components/CrisisStrip.astro`

**Interfaces:**
- Consumes: `site` (Task 4), `telHref`/`toPersianDigits` (Task 3), layout classes (Task 2).
- Produces: `CrisisStrip.astro` (props: none) — reusable in Footer and contact page. Header/Footer are layout-internal; no other consumer.

- [ ] **Step 1: Create `src/components/CrisisStrip.astro`**

```astro
---
import { site } from "../data/site";
import { toPersianDigits } from "../utils/persian";
import { telHref } from "../utils/links";
---
<div class="bg-primary-900 text-primary-50">
  <div class="container-site flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-3 text-sm">
    <span class="font-semibold">در شرایط بحرانی تنها نیستید:</span>
    {site.crisisLines.map((line) => (
      <a href={telHref(line.number)} class="inline-flex items-center gap-1 underline underline-offset-4 hover:text-white">
        {line.label}: <bdi>{toPersianDigits(line.number)}</bdi>
      </a>
    ))}
  </div>
</div>
```

Note: crisis lines display in Persian digits for humans but the crisis numbers ۱۴۸۰/۱۲۳ must dial correctly — `telHref` keeps digits only; Persian-digit labels are display text. Verify at Task 18 on a real phone.

- [ ] **Step 2: Replace `src/components/Header.astro`**

```astro
---
import { site } from "../data/site";
import { telHref } from "../utils/links";

const nav = [
  { href: "/", label: "خانه" },
  { href: "/services/", label: "خدمات" },
  { href: "/therapists/", label: "درمانگران" },
  { href: "/workshops/", label: "کارگاه‌ها" },
  { href: "/articles/", label: "مقالات" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس" },
];
const current = Astro.url.pathname;
const isActive = (href: string) =>
  href === "/" ? current === "/" : current.startsWith(href);
const primaryPhone = site.phones[0];
---
<header class="sticky top-0 z-40 border-b border-primary-100 bg-bg/90 backdrop-blur">
  <div class="container-site flex h-16 items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-2 text-lg font-extrabold text-primary-700">
      <span aria-hidden="true" class="grid size-9 place-items-center rounded-xl bg-primary-600 text-white">پ</span>
      <span class="hidden sm:inline">{site.shortName}</span>
    </a>

    <nav aria-label="ناوبری اصلی" class="hidden items-center gap-1 lg:flex">
      {nav.map((item) => (
        <a
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          class:list={[
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(item.href) ? "bg-primary-100 text-primary-800" : "text-ink-muted hover:bg-primary-50 hover:text-primary-700",
          ]}
        >
          {item.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-2">
      <a href={telHref(primaryPhone.number)} class="btn btn-primary hidden sm:inline-flex">رزرو نوبت</a>
      <button
        id="menu-toggle"
        type="button"
        class="btn btn-secondary lg:hidden"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <span class="sr-only">باز کردن منو</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>

  <div
    id="mobile-menu"
    class="fixed inset-y-0 start-0 z-50 w-72 translate-x-full bg-surface p-6 shadow-soft transition-transform duration-300 lg:hidden"
  >
    <div class="mb-6 flex items-center justify-between">
      <span class="text-lg font-extrabold text-primary-700">{site.shortName}</span>
      <button id="menu-close" type="button" class="btn btn-ghost px-2 py-1" >
        <span class="sr-only">بستن منو</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav aria-label="ناوبری موبایل" class="flex flex-col gap-1">
      {nav.map((item) => (
        <a
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          class:list={[
            "rounded-lg px-3 py-2.5 text-base font-medium",
            isActive(item.href) ? "bg-primary-100 text-primary-800" : "text-ink hover:bg-primary-50",
          ]}
        >
          {item.label}
        </a>
      ))}
      <a href={telHref(primaryPhone.number)} class="btn btn-primary mt-4">رزرو نوبت</a>
    </nav>
  </div>
  <div id="menu-backdrop" class="fixed inset-0 z-40 hidden bg-ink/40 lg:hidden"></div>
</header>
```

- [ ] **Step 3: Replace `src/scripts/menu.ts`** (drawer open/close, Esc, focus trap, scroll lock)

```ts
const toggle = document.getElementById("menu-toggle");
const closeBtn = document.getElementById("menu-close");
const menu = document.getElementById("mobile-menu");
const backdrop = document.getElementById("menu-backdrop");

function focusables(): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  );
}

function openMenu() {
  if (!menu || !toggle || !backdrop) return;
  menu.classList.remove("translate-x-full");
  backdrop.classList.remove("hidden");
  toggle.setAttribute("aria-expanded", "true");
  document.documentElement.style.overflow = "hidden";
  focusables()[0]?.focus();
}

function closeMenu() {
  if (!menu || !toggle || !backdrop) return;
  menu.classList.add("translate-x-full");
  backdrop.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
  document.documentElement.style.overflow = "";
  toggle.focus();
}

toggle?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (!menu || menu.classList.contains("translate-x-full")) return;
  if (e.key === "Escape") {
    closeMenu();
    return;
  }
  if (e.key === "Tab") {
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
```

- [ ] **Step 4: Replace `src/scripts/reveal.ts`**

```ts
const elements = document.querySelectorAll<HTMLElement>(".reveal");
if (elements.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  elements.forEach((el) => observer.observe(el));
} else {
  elements.forEach((el) => el.classList.add("is-visible"));
}
```

- [ ] **Step 5: Replace `src/components/Footer.astro`**

```astro
---
import { site } from "../data/site";
import { telHref, whatsappLink } from "../utils/links";
import { toPersianDigits } from "../utils/persian";
import CrisisStrip from "./CrisisStrip.astro";

const year = toPersianDigits(site.foundedYear);
---
<footer class="mt-auto border-t border-primary-100 bg-surface">
  <div class="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
    <section aria-label="درباره کلینیک">
      <p class="text-lg font-extrabold text-primary-700">{site.shortName}</p>
      <p class="mt-2 text-sm text-ink-muted">{site.tagline}</p>
      <p class="mt-4 text-xs text-ink-muted">
        {site.licenses.map((l) => `${l.org} — ${l.number}`).join(" · ")}
      </p>
    </section>

    <nav aria-label="پیوندهای سریع">
      <p class="mb-3 font-bold">دسترسی سریع</p>
      <ul class="space-y-2 text-sm text-ink-muted">
        <li><a class="hover:text-primary-700" href="/services/">خدمات</a></li>
        <li><a class="hover:text-primary-700" href="/therapists/">درمانگران</a></li>
        <li><a class="hover:text-primary-700" href="/workshops/">کارگاه‌ها</a></li>
        <li><a class="hover:text-primary-700" href="/articles/">مقالات</a></li>
        <li><a class="hover:text-primary-700" href="/faq/">سؤالات متداول</a></li>
        <li><a class="hover:text-primary-700" href="/about/">درباره ما</a></li>
      </ul>
    </nav>

    <section aria-label="تماس">
      <p class="mb-3 font-bold">تماس با ما</p>
      <ul class="space-y-2 text-sm text-ink-muted">
        {site.phones.map((p) => (
          <li><a class="hover:text-primary-700" href={telHref(p.number)}><bdi>{toPersianDigits(p.number)}</bdi></a></li>
        ))}
        {site.whatsapp && (
          <li><a class="hover:text-primary-700" href={whatsappLink(site.whatsapp)}>واتساپ کلینیک</a></li>
        )}
        <li class="leading-6">{site.address}</li>
      </ul>
    </section>

    <section aria-label="ساعت کاری">
      <p class="mb-3 font-bold">ساعت کاری</p>
      <ul class="space-y-1.5 text-sm text-ink-muted">
        {site.hours.map((h) => (
          <li class="flex justify-between gap-4"><span>{h.days}</span><span>{h.time}</span></li>
        ))}
      </ul>
    </section>
  </div>

  <CrisisStrip />

  <div class="border-t border-primary-100 py-4">
    <p class="container-site text-center text-xs text-ink-muted">
      © {year} کلینیک علمی روانشناسی پندار نیم رخ — کلیه حقوق محفوظ است.
    </p>
  </div>
</footer>
```

- [ ] **Step 6: Verify behavior**

Run: `npm run build && npm run preview` then in a browser at http://localhost:4321:
- Resize to <1024px: hamburger appears; drawer opens from the right (RTL start), Esc closes, focus moves into drawer and returns to toggle.
- Keyboard: Tab from address bar reaches «پرش به محتوای اصلی» first.
Expected: all true. Stop preview.

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ src/scripts/
git commit -m "feat: header with accessible mobile drawer, footer with crisis strip, scroll reveal"
```

---

### Task 8: Shared UI components

**Files:**
- Create: `src/components/SectionHeading.astro`, `src/components/StatusBadge.astro`, `src/components/cards/ServiceCard.astro`, `src/components/cards/TherapistCard.astro`, `src/components/cards/WorkshopCard.astro`, `src/components/cards/ArticleCard.astro`, `src/components/cards/TestimonialCard.astro`, `src/components/CtaStrip.astro`, `src/components/ContactChannels.astro`, `src/components/HoursTable.astro`, `src/components/Breadcrumbs.astro`

**Interfaces:**
- Consumes: collections' frontmatter shapes (Task 5), `site` (Task 4), utils (Task 3), asset maps (Task 5).
- Produces (consumed by Tasks 9–14):
  - `SectionHeading`: `{ eyebrow?: string; title: string; lead?: string }`
  - `StatusBadge`: `{ status: "open" | "full" | "past" }` → ثبتنام باز / تکمیل ظرفیت / برگزار شد
  - `ServiceCard`: `{ title, summary, category, icon, href }`
  - `TherapistCard`: `{ id, name, title, specialties, featured }`
  - `WorkshopCard`: `{ id, title, instructor, dateDisplay, status }`
  - `ArticleCard`: `{ id, title, description, dateDisplay, category, readingTime }`
  - `TestimonialCard`: `{ quote, attribution }`
  - `CtaStrip`: `{}` (pulls everything from `site`)
  - `ContactChannels`: `{ compact?: boolean }`
  - `HoursTable`: `{ title?: string }`
  - `Breadcrumbs`: `{ items: { label: string; href?: string }[] }` (renders `aria-label="مسیر صفحه"` nav + `BreadcrumbList` JSON-LD via a returned object? NO — Breadcrumbs renders visible nav only; JSON-LD is emitted by pages via their own `jsonLd` prop.)

- [ ] **Step 1: `src/components/SectionHeading.astro`**

```astro
---
interface Props {
  eyebrow?: string;
  title: string;
  lead?: string;
}
const { eyebrow, title, lead } = Astro.props;
---
<div class="mx-auto mb-10 max-w-2xl text-center">
  {eyebrow && <p class="eyebrow mb-2">{eyebrow}</p>}
  <h2 class="text-3xl sm:text-4xl">{title}</h2>
  {lead && <p class="mt-3 text-ink-muted">{lead}</p>}
</div>
```

- [ ] **Step 2: `src/components/StatusBadge.astro`**

```astro
---
interface Props {
  status: "open" | "full" | "past";
}
const { status } = Astro.props;
const labels = {
  open: { text: "ثبت‌نام باز", cls: "bg-status-open-bg text-status-open" },
  full: { text: "تکمیل ظرفیت", cls: "bg-status-full-bg text-status-full" },
  past: { text: "برگزار شد", cls: "bg-status-past-bg text-status-past" },
};
const label = labels[status];
---
<span class:list={["badge", label.cls]}>{label.text}</span>
```

- [ ] **Step 3: `src/components/icons.ts`** — inline SVG path data (24×24, stroke style), used by cards and channels:

```ts
export const iconPaths: Record<string, string> = {
  individual: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  couples: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0m-2-9a5 5 0 0 1 10 9",
  child: "M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-5 13a5 5 0 0 1 10 0M9 12h6l-1 4h-4z",
  group: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 1a2.5 2.5 0 1 0 0-5M3 20a6 6 0 0 1 12 0m1-6a5 5 0 0 1 5 6",
  assessment: "M9 3h6v4H9zM5 5h2m10 0h2M12 7v4m0 0-3 3m3-3 3 3M4 21h16M6 21v-6h12v6",
  workshop: "M4 8h16v10H4zM9 4v4m6-4v4M4 12h16",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  whatsapp: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm4.2 12.2c-.2.5-1 1-1.5 1.1-.4.1-.9.1-1.5-.1a12 12 0 0 1-5.4-4.7c-.4-.7-.6-1.4-.6-2 0-.6.3-1.2.7-1.5.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.8c0 .2 0 .3-.1.5l-.5.6c-.1.2-.2.3 0 .6a8 8 0 0 0 3 2.6c.3.1.5.1.7-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.9c.2.1.3.2.3.4s0 .6-.2.8Z",
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.2 6.8h.01",
  telegram: "M21 4 3 11l5.5 2L10 19l3-3.5L18 19l3-15ZM8.5 13l9-7",
  chat: "M4 5h16v11H9l-5 4V5Z", // generic messenger (Eitaa/Bale until official brand SVGs are provided)
  map: "M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.5 2",
  calendar: "M5 5h14v16H5zM5 9h14M9 3v4m6-4v4",
  arrow: "M19 12H5m6-7-7 7 7 7", // points LEFT = forward direction in RTL
};
```

- [ ] **Step 4: `src/components/Icon.astro`**

```astro
---
import { iconPaths } from "./icons";
interface Props {
  name: keyof typeof iconPaths;
  size?: number;
}
const { name, size = 20 } = Astro.props;
---
<svg
  aria-hidden="true"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  set:html={`<path d="${iconPaths[name]}" />`}
/>
```

- [ ] **Step 5: `src/components/cards/ServiceCard.astro`**

```astro
---
import Icon from "../Icon.astro";
import { toPersianDigits } from "../../utils/persian";

interface Props {
  title: string;
  summary: string;
  category: string;
  icon: string;
  href: string;
  order?: number;
}
const { title, summary, category, icon, href, order } = Astro.props;
---
<a href={href} class="card reveal group flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1">
  <span class="grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary-600">
    <Icon name={icon} size={24} />
  </span>
  <div>
    <h3 class="text-lg font-bold group-hover:text-primary-700">{title}</h3>
    <p class="mt-1 text-sm text-ink-muted">{summary}</p>
  </div>
  <div class="mt-auto flex items-center justify-between pt-2 text-xs">
    <span class="badge bg-primary-50 text-primary-700">{category}</span>
    <span class="inline-flex items-center gap-1 font-semibold text-primary-600">
      جزئیات <Icon name="arrow" size={16} />
    </span>
  </div>
</a>
```

- [ ] **Step 6: `src/components/cards/TherapistCard.astro`**

```astro
---
import { therapistPhotos } from "../../utils/assets";

interface Props {
  id: string;
  name: string;
  title: string;
  specialties: string[];
}
const { id, name, title, specialties } = Astro.props;
const photo = therapistPhotos[id];
---
<a href={`/therapists/${id}/`} class="card reveal group overflow-hidden transition-transform hover:-translate-y-1">
  <img
    src={photo?.src}
    alt={`تصویر ${name}`}
    width="600"
    height="600"
    loading="lazy"
    class="aspect-square w-full object-cover"
  />
  <div class="p-5">
    <h3 class="font-bold group-hover:text-primary-700">{name}</h3>
    <p class="mt-0.5 text-sm text-ink-muted">{title}</p>
    <div class="mt-3 flex flex-wrap gap-1.5">
      {specialties.slice(0, 3).map((s) => (
        <span class="badge bg-primary-50 text-primary-700">{s}</span>
      ))}
    </div>
  </div>
</a>
```

- [ ] **Step 7: `src/components/cards/WorkshopCard.astro`**

```astro
---
import Icon from "../Icon.astro";
import StatusBadge from "./StatusBadge.astro";

interface Props {
  href: string;
  title: string;
  instructor: string;
  dateDisplay: string;
  status: "open" | "full" | "past";
}
const { href, title, instructor, dateDisplay, status } = Astro.props;
---
<a href={href} class:list={["card reveal block p-6 transition-transform hover:-translate-y-1", status === "past" && "opacity-75"]}>
  <div class="flex items-center justify-between gap-3">
    <StatusBadge status={status} />
    <span class="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <Icon name="calendar" size={16} />
      {dateDisplay}
    </span>
  </div>
  <h3 class="mt-3 text-lg font-bold">{title}</h3>
  <p class="mt-1 text-sm text-ink-muted">مدرس: {instructor}</p>
</a>
```

- [ ] **Step 8: `src/components/cards/ArticleCard.astro`**

```astro
---
import { articleCovers } from "../../utils/assets";
import { toPersianDigits } from "../../utils/persian";

interface Props {
  id: string;
  title: string;
  description: string;
  dateDisplay: string;
  category: string;
  readingTime: number;
}
const { id, title, description, dateDisplay, category, readingTime } = Astro.props;
const cover = articleCovers[id];
---
<a href={`/articles/${id}/`} class="card reveal group overflow-hidden transition-transform hover:-translate-y-1">
  {cover ? (
    <img src={cover.src} alt="" width="1200" height="630" loading="lazy" class="aspect-[1200/630] w-full object-cover" />
  ) : (
    <div class="aspect-[1200/630] w-full bg-gradient-to-bl from-primary-200 to-primary-50" aria-hidden="true"></div>
  )}
  <div class="p-5">
    <div class="flex items-center gap-2 text-xs text-ink-muted">
      <span class="badge bg-primary-50 text-primary-700">{category}</span>
      <span>{dateDisplay}</span>
      <span aria-hidden="true">·</span>
      <span>{toPersianDigits(readingTime)} دقیقه مطالعه</span>
    </div>
    <h3 class="mt-2 font-bold leading-7 group-hover:text-primary-700">{title}</h3>
    <p class="mt-1 line-clamp-2 text-sm text-ink-muted">{description}</p>
  </div>
</a>
```

- [ ] **Step 9: `src/components/cards/TestimonialCard.astro`**

```astro
---
interface Props {
  quote: string;
  attribution: string;
}
const { quote, attribution } = Astro.props;
---
<figure class="card reveal p-6">
  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" class="mb-3 text-primary-300" fill="currentColor"><path d="M10 8c-3 .5-5 2.6-5 6v2h5v-6H7.5C7.8 9 8.8 8.5 10 8.3V8Zm9 0c-3 .5-5 2.6-5 6v2h5v-6h-2.5c.3-1 1.3-1.5 2.5-1.7V8Z"/></svg>
  <blockquote class="text-ink">{quote}</blockquote>
  <figcaption class="mt-3 text-sm font-semibold text-ink-muted">{attribution}</figcaption>
</figure>
```

- [ ] **Step 10: `src/components/ContactChannels.astro`**

```astro
---
import { site } from "../data/site";
import { telHref, whatsappLink } from "../utils/links";
import Icon from "./Icon.astro";

interface Props {
  compact?: boolean;
}
const { compact = false } = Astro.props;

const primaryPhone = site.phones[0];
const channels = [
  site.whatsapp && {
    label: "واتساپ",
    href: whatsappLink(site.whatsapp),
    icon: "whatsapp",
    cls: "btn-whatsapp",
  },
  { label: primaryPhone.label, href: telHref(primaryPhone.number), icon: "phone", cls: "btn-call" },
  site.telegram && { label: "تلگرام", href: site.telegram, icon: "telegram", cls: "btn-secondary" },
  site.instagram && { label: "اینستاگرام", href: site.instagram, icon: "instagram", cls: "btn-secondary" },
  site.eitea && { label: "ایتا", href: site.eitea, icon: "chat", cls: "btn-secondary" },
  site.bale && { label: "بله", href: site.bale, icon: "chat", cls: "btn-secondary" },
].filter(Boolean) as { label: string; href: string; icon: string; cls: string }[];
---
<div class:list={["flex flex-wrap gap-3", compact && "gap-2"]}>
  {channels.map((c) => (
    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" class:list={["btn", c.cls, compact && "px-3.5 py-2 text-xs"]}>
      <Icon name={c.icon} size={compact ? 16 : 18} />
      {c.label}
    </a>
  ))}
</div>
```

- [ ] **Step 11: `src/components/CtaStrip.astro`**

```astro
---
import { site } from "../data/site";
import ContactChannels from "./ContactChannels.astro";
import HoursTable from "./HoursTable.astro";
---
<section class="section bg-primary-600 text-white" aria-label="رزرو نوبت">
  <div class="container-site grid items-center gap-10 lg:grid-cols-2">
    <div>
      <h2 class="text-3xl">قدم اول را بردارید</h2>
      <p class="mt-3 text-primary-100">
        برای رزرو نوبت یا هر پرسشی، از راه راحت‌تر برای شما تماس بگیرید. پاسخگویی اولیه کاملاً محرمانه است.
      </p>
      <div class="mt-6">
        <ContactChannels />
      </div>
    </div>
    <div class="rounded-2xl bg-white/10 p-6">
      <HoursTable title="ساعت کاری کلینیک" variant="on-dark" />
      <p class="mt-4 text-sm text-primary-100">{site.address}</p>
    </div>
  </div>
</section>
```

- [ ] **Step 12: `src/components/HoursTable.astro`**

```astro
---
import { site } from "../data/site";

interface Props {
  title?: string;
  variant?: "default" | "on-dark";
}
const { title = "ساعت کاری", variant = "default" } = Astro.props;
---
<div>
  {title && (
    <p class:list={["mb-3 font-bold", variant === "on-dark" && "text-white"]}>{title}</p>
  )}
  <table class="w-full text-sm">
    <caption class="sr-only">{title}</caption>
    <tbody>
      {site.hours.map((h) => (
        <tr class:list={["border-b last:border-0", variant === "on-dark" ? "border-white/15" : "border-primary-100"]}>
          <th scope="row" class:list={["py-2 text-start font-medium", variant === "on-dark" ? "text-primary-100" : "text-ink-muted"]}>{h.days}</th>
          <td class:list={["py-2 text-end", variant === "on-dark" ? "text-white" : "text-ink"]}>{h.time}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 13: `src/components/Breadcrumbs.astro`**

```astro
---
import Icon from "./Icon.astro";

interface Props {
  items: { label: string; href?: string }[];
}
const { items } = Astro.props;
---
<nav aria-label="مسیر صفحه" class="text-sm text-ink-muted">
  <ol class="flex flex-wrap items-center gap-1.5">
    {items.map((item, i) => (
      <li class="flex items-center gap-1.5">
        {i > 0 && <Icon name="arrow" size={14} class="rotate-180" aria-hidden="true" />}
        {item.href ? (
          <a href={item.href} class="hover:text-primary-700">{item.label}</a>
        ) : (
          <span aria-current="page" class="font-medium text-ink">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

Note: `Icon.astro` doesn't accept `class`/extra attrs — add `const { name, size = 20, class: className } = Astro.props;` and `class={className}` on the `<svg>` in this step.

- [ ] **Step 14: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors, build passes.

- [ ] **Step 15: Commit**

```bash
git add src/components/
git commit -m "feat: shared UI components — cards, badges, channels, breadcrumbs, CTA strip"
```

---

### Task 9: Home page

**Files:**
- Modify: `src/pages/index.astro` (full replacement)

**Interfaces:**
- Consumes: everything from Tasks 2–8. Produces: none (leaf page).

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import SectionHeading from "../components/SectionHeading.astro";
import ServiceCard from "../components/cards/ServiceCard.astro";
import TherapistCard from "../components/cards/TherapistCard.astro";
import WorkshopCard from "../components/cards/WorkshopCard.astro";
import ArticleCard from "../components/cards/ArticleCard.astro";
import TestimonialCard from "../components/cards/TestimonialCard.astro";
import CtaStrip from "../components/CtaStrip.astro";
import { site } from "../data/site";
import { testimonials } from "../data/testimonials";
import { toPersianDigits } from "../utils/persian";
import { readingTimeMinutes } from "../utils/readingtime";

const services = (await getCollection("services")).sort((a, b) => a.data.order - b.data.order);
const therapists = (await getCollection("therapists"))
  .filter((t) => t.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 4);
const workshops = (await getCollection("workshops"))
  .filter((w) => w.data.status !== "past")
  .sort((a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf())
  .slice(0, 3);
const articles = (await getCollection("articles"))
  .filter((a) => !a.data.draft)
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
  .slice(0, 3);
const shownTestimonials = testimonials.filter((t) => t.consent).slice(0, 4);
const primaryPhone = site.phones[0];

const whyUs = [
  { title: "درمانگران دارای پروانه", text: "همه درمانگران ما دارای پروانه فعالیت معتبر از سازمان نظام روانشناسی و مشاوره هستند." },
  { title: "رویکردهای مبتنی بر شواهد", text: "از درمان‌های علمی و اثبات‌شده مانند CBT استفاده می‌کنیم؛ نه ادعا، بلکه روش." },
  { title: "رازداری کامل", text: "همه گفت‌وگوها و اطلاعات شما محرمانه می‌ماند؛ امنیت روان شما اولویت ماست." },
  { title: "فضایی آرام و امن", text: "فضای کلینیک برای آرامش از همان لحظه ورود طراحی شده است." },
];
---
<BaseLayout
  title="کلینیک علمی روانشناسی پندار نیم رخ | درمان تخصصی در قم"
  description={site.tagline}
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "Psychologist",
      name: site.name,
      url: site.url,
      telephone: site.phones[0].number,
      address: { "@type": "PostalAddress", addressLocality: "قم", addressCountry: "IR", streetAddress: site.address },
      openingHours: "Sa-We 16:00-21:00 Th 09:00-13:00",
      image: new URL("/og-default.png", site.url).href,
    },
  ]}
>
  <!-- ۱. Hero -->
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-bl from-primary-50 via-bg to-primary-100" aria-hidden="true"></div>
    <div class="container-site relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p class="eyebrow">کلینیک علمی روانشناسی</p>
        <h1 class="mt-3 text-4xl leading-[1.25] sm:text-5xl">
          سلامت روان شما، <span class="text-primary-600">با روش علمی</span> و در فضایی آرام
        </h1>
        <p class="mt-5 max-w-xl text-lg text-ink-muted">
          کلینیک پندار نیم رخ با تیمی از درمانگران دارای پروانه، مسیر درمانی امن و محرمانه را برای شما و عزیزانتان فراهم می‌کند.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${primaryPhone.number.replace(/[^+\d]/g, "")}`} class="btn btn-primary px-7 py-3 text-base">رزرو نوبت</a>
          <a href="/services/" class="btn btn-secondary px-7 py-3 text-base">خدمات کلینیک</a>
        </div>
        <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <li class="flex items-center gap-1.5">پروانه {site.licenses[0].number}</li>
          <li class="flex items-center gap-1.5">از سال {toPersianDigits(site.foundedYear)}</li>
        </ul>
      </div>
      <div class="relative hidden lg:block" aria-hidden="true">
        <div class="absolute -inset-6 rounded-[3rem] bg-primary-100"></div>
        <div class="relative grid size-full min-h-80 place-items-center rounded-[2.5rem] bg-gradient-to-bl from-primary-200 to-primary-50 shadow-soft">
          <span class="text-8xl">🌿</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ۲. خدمات -->
  <section class="section bg-surface" aria-labelledby="services-title">
    <div class="container-site">
      <SectionHeading eyebrow="خدمات ما" title="خدمات تخصصی کلینیک" lead="از درمان فردی تا ارزیابی کودک — با روش‌های علمی و مبتنی بر شواهد" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard
            title={s.data.title}
            summary={s.data.summary}
            category={s.data.category}
            icon={s.data.icon}
            href={`/services/${s.id}/`}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- ۳. چرا ما -->
  <section class="section" aria-labelledby="why-title">
    <div class="container-site">
      <SectionHeading eyebrow="چرا پندار نیم رخ" title="اعتماد شما، مسئولیت ما" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {whyUs.map((item) => (
          <div class="card reveal p-6">
            <h3 class="font-bold text-primary-700">{item.title}</h3>
            <p class="mt-2 text-sm leading-7 text-ink-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- ۴. درمانگران -->
  <section class="section bg-surface" aria-labelledby="team-title">
    <div class="container-site">
      <SectionHeading eyebrow="تیم ما" title="درمانگران کلینیک" lead="با متخصصان ما آشنا شوید" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {therapists.map((t) => (
          <TherapistCard id={t.id} name={t.data.name} title={t.data.title} specialties={t.data.specialties} />
        ))}
      </div>
      <p class="mt-8 text-center">
        <a href="/therapists/" class="btn btn-secondary">مشاهده همه درمانگران</a>
      </p>
    </div>
  </section>

  <!-- ۵. کارگاه‌ها -->
  <section class="section" aria-labelledby="workshops-title">
    <div class="container-site">
      <SectionHeading eyebrow="آموزش" title="کارگاه‌های پیشِ رو" lead="مهارت‌های روانی را در محیطی گروهی و کاربردی تمرین کنید" />
      <div class="grid gap-6 md:grid-cols-3">
        {workshops.map((w) => (
          <WorkshopCard
            href={`/workshops/${w.id}/`}
            title={w.data.title}
            instructor={w.data.instructor}
            dateDisplay={w.data.dateDisplay}
            status={w.data.status}
          />
        ))}
      </div>
      <p class="mt-8 text-center">
        <a href="/workshops/" class="btn btn-secondary">همه کارگاه‌ها</a>
      </p>
    </div>
  </section>

  <!-- ۶. نظرات مراجعین -->
  <section class="section bg-surface" aria-labelledby="testimonials-title">
    <div class="container-site">
      <SectionHeading eyebrow="تجربه مراجعین" title="آنچه مراجعان ما می‌گویند" />
      <div class="grid gap-6 md:grid-cols-3">
        {shownTestimonials.map((t) => (
          <TestimonialCard quote={t.quote} attribution={t.attribution} />
        ))}
      </div>
    </div>
  </section>

  <!-- ۷. مقالات -->
  <section class="section" aria-labelledby="articles-title">
    <div class="container-site">
      <SectionHeading eyebrow="خواندنی‌ها" title="آخرین مقالات" />
      <div class="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard
            id={a.id}
            title={a.data.title}
            description={a.data.description}
            dateDisplay={a.data.dateDisplay}
            category={a.data.category}
            readingTime={readingTimeMinutes(a.body ?? "")}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- ۸. نوار تماس -->
  <CtaStrip />
</BaseLayout>
```

Note: `a.body` — in content-layer collections, `entry.body` holds the raw markdown string. If `astro check` reports `body` as possibly undefined, guard with `a.body ?? ""` (already done above).

- [ ] **Step 2: Visual verification**

Run: `npm run dev` and open http://localhost:4321 in a browser.
Check: RTL alignment correct everywhere; hero, 8 sections, footer render; cards lift on hover; drawer works; Persian digits render; no horizontal overflow at 360/768/1280 widths; scroll-reveal works and is instant under reduced-motion emulation.
Expected: all true. Fix any visual issue before committing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home page with all sections"
```

### Task 10: Services pages (index + detail)

**Files:**
- Create: `src/pages/services/index.astro`, `src/pages/services/[slug].astro`

**Interfaces:**
- Consumes: `services` collection, `ServiceCard`, `Breadcrumbs`, `SectionHeading`, `BaseLayout`.
- Produces: routes `/services/` and `/services/[id]/`. Detail pages emit `BreadcrumbList` JSON-LD.

- [ ] **Step 1: `src/pages/services/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import SectionHeading from "../../components/SectionHeading.astro";
import ServiceCard from "../../components/cards/ServiceCard.astro";

const services = (await getCollection("services")).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout
  title="خدمات کلینیک | پندار نیم رخ"
  description="خدمات تخصصی روانشناسی در قم: درمان فردی، زوج‌درمانی، خانواده‌درمانی، کودک و نوجوان، گروه‌درمانی و ارزیابی."
>
  <div class="container-site pt-10">
    <h1 class="text-3xl sm:text-4xl">خدمات کلینیک</h1>
    <p class="mt-3 max-w-2xl text-ink-muted">
      هر خدمت صفحه اختصاصی دارد؛ برای آشنایی بیشتر روی هر کارت بزنید یا مستقیم برای نوبت تماس بگیرید.
    </p>
  </div>
  <section class="container-site section">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <ServiceCard
          title={s.data.title}
          summary={s.data.summary}
          category={s.data.category}
          icon={s.data.icon}
          href={`/services/${s.id}/`}
        />
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: `src/pages/services/[slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import ContactChannels from "../../components/ContactChannels.astro";
import { site } from "../../data/site";

export async function getStaticPaths() {
  const services = await getCollection("services");
  return services.map((service) => ({
    params: { slug: service.id },
    props: { service },
  }));
}
const { service } = Astro.props;
const { Content } = await render(service);
---
<BaseLayout
  title={`${service.data.title} | پندار نیم رخ`}
  description={service.data.summary}
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: site.url },
        { "@type": "ListItem", position: 2, name: "خدمات", item: `${site.url}/services/` },
        { "@type": "ListItem", position: 3, name: service.data.title },
      ],
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "خدمات", href: "/services/" }, { label: service.data.title }]} />
    <div class="mt-6 max-w-3xl">
      <span class="badge bg-primary-50 text-primary-700">{service.data.category}</span>
      <h1 class="mt-3 text-3xl sm:text-4xl">{service.data.title}</h1>
      <p class="mt-3 text-lg text-ink-muted">{service.data.summary}</p>
    </div>
  </div>
  <section class="container-site section grid gap-10 lg:grid-cols-[1fr_320px]">
    <article class="prose-fa">
      <Content />
    </article>
    <aside class="card h-fit p-6">
      <h2 class="text-lg font-bold">رزرو این خدمت</h2>
      <p class="mt-2 text-sm text-ink-muted">برای هماهنگی نوبت، از راه زیر تماس بگیرید.</p>
      <div class="mt-4">
        <ContactChannels compact />
      </div>
    </aside>
  </section>
</BaseLayout>
```

(Design note: linking therapists-per-service requires a relation field; spec §4.2 lists it, but it needs real clinic data to be meaningful. Add `relatedTherapists: z.array(z.string()).default([])` to the services schema in Task 5 and render matching therapist cards when non-empty — include this in this task.)

- [ ] **Step 3: Add therapist relation** — in `src/content.config.ts` add to the services schema:

```ts
    relatedTherapists: z.array(z.string()).default([]),
```

In `[slug].astro` aside, above `ContactChannels`, render:

```astro
      {service.data.relatedTherapists.length > 0 && (
        <div class="mt-6">
          <h3 class="text-sm font-bold text-ink-muted">درمانگران این خدمت</h3>
          <ul class="mt-2 space-y-2">
            {service.data.relatedTherapists.map((tid) => (
              <li><a class="text-sm font-semibold text-primary-600 hover:underline" href={`/therapists/${tid}/`}>{tid}</a></li>
            ))}
          </ul>
        </div>
      )}
```

And add `relatedTherapists: ["dr-sara-mohammadi", "dr-ali-hosseini"]` to `individual-therapy.md` frontmatter (and matching entries for other services).

- [ ] **Step 4: Verify**

Run: `npm run build && ls dist/services/`
Expected: `index.html` plus one directory per service, each with `index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/services/ src/content.config.ts src/content/services/
git commit -m "feat: services index and detail pages with breadcrumbs"
```

---

### Task 11: Therapists pages (index + detail)

**Files:**
- Create: `src/pages/therapists/index.astro`, `src/pages/therapists/[slug].astro`

**Interfaces:**
- Produces: `/therapists/`, `/therapists/[id]/` with `Person` JSON-LD on profiles.

- [ ] **Step 1: `src/pages/therapists/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import SectionHeading from "../../components/SectionHeading.astro";
import TherapistCard from "../../components/cards/TherapistCard.astro";

const therapists = (await getCollection("therapists")).sort(
  (a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order,
);
---
<BaseLayout
  title="درمانگران | پندار نیم رخ"
  description="تیم درمانگران کلینیک علمی روانشناسی پندار نیم رخ — متخصصان دارای پروانه در حوزه‌های فردی، زوج، خانواده و کودک."
>
  <div class="container-site pt-10">
    <h1 class="text-3xl sm:text-4xl">درمانگران کلینیک</h1>
    <p class="mt-3 max-w-2xl text-ink-muted">همه درمانگران ما دارای پروانه فعالیت معتبر هستند.</p>
  </div>
  <section class="container-site section">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {therapists.map((t) => (
        <TherapistCard id={t.id} name={t.data.name} title={t.data.title} specialties={t.data.specialties} />
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: `src/pages/therapists/[slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import ContactChannels from "../../components/ContactChannels.astro";
import { site } from "../../data/site";
import { therapistPhotos } from "../../utils/assets";

export async function getStaticPaths() {
  const therapists = await getCollection("therapists");
  return therapists.map((therapist) => ({
    params: { slug: therapist.id },
    props: { therapist },
  }));
}
const { therapist } = Astro.props;
const { Content } = await render(therapist);
const photo = therapistPhotos[therapist.id];
const whatsappMsg = encodeURIComponent(`سلام، برای نوبت با ${therapist.data.name} تماس می‌گیرم.`);
---
<BaseLayout
  title={`${therapist.data.name} | پندار نیم رخ`}
  description={`${therapist.data.name} — ${therapist.data.title} در کلینیک علمی روانشناسی پندار نیم رخ`}
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: therapist.data.name,
      jobTitle: therapist.data.title,
      worksFor: { "@type": "Psychologist", name: site.name, url: site.url },
      image: photo ? new URL(photo.src, site.url).href : undefined,
      knowsAbout: therapist.data.specialties,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: site.url },
        { "@type": "ListItem", position: 2, name: "درمانگران", item: `${site.url}/therapists/` },
        { "@type": "ListItem", position: 3, name: therapist.data.name },
      ],
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "درمانگران", href: "/therapists/" }, { label: therapist.data.name }]} />
  </div>
  <section class="container-site section grid gap-10 lg:grid-cols-[320px_1fr]">
    <div>
      <img
        src={photo?.src}
        alt={`تصویر ${therapist.data.name}`}
        width="600"
        height="600"
        class="card aspect-square w-full object-cover"
      />
    </div>
    <div>
      <h1 class="text-3xl sm:text-4xl">{therapist.data.name}</h1>
      <p class="mt-2 text-lg text-ink-muted">{therapist.data.title}</p>
      <p class="mt-1 text-sm text-ink-muted">{therapist.data.licenseNumber}</p>

      <dl class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="card p-4">
          <dt class="text-sm font-bold text-primary-700">حوزه‌های تخصصی</dt>
          <dd class="mt-2 flex flex-wrap gap-1.5">
            {therapist.data.specialties.map((s) => <span class="badge bg-primary-50 text-primary-700">{s}</span>)}
          </dd>
        </div>
        <div class="card p-4">
          <dt class="text-sm font-bold text-primary-700">رویکردهای درمانی</dt>
          <dd class="mt-2 flex flex-wrap gap-1.5">
            {therapist.data.approaches.map((a) => <span class="badge bg-primary-50 text-primary-700">{a}</span>)}
          </dd>
        </div>
        <div class="card p-4">
          <dt class="text-sm font-bold text-primary-700">تحصیلات و گواهی‌ها</dt>
          <dd class="mt-2">
            <ul class="list-disc space-y-1 ps-5 text-sm text-ink-muted">
              {therapist.data.education.map((e) => <li>{e}</li>)}
            </ul>
          </dd>
        </div>
        <div class="card p-4">
          <dt class="text-sm font-bold text-primary-700">زبان‌ها</dt>
          <dd class="mt-2 text-sm text-ink-muted">{therapist.data.languages.join("، ")}</dd>
        </div>
      </dl>

      <div class="card mt-6 p-6">
        <h2 class="text-lg font-bold">رزرو نوبت با {therapist.data.name}</h2>
        <div class="mt-4">
          <ContactChannels compact />
        </div>
      </div>
    </div>
  </section>
  <section class="container-site pb-20">
    <article class="prose-fa mx-auto">
      <Content />
    </article>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `npm run build && ls dist/therapists/`
Expected: index + 4 profile directories.

- [ ] **Step 4: Commit**

```bash
git add src/pages/therapists/
git commit -m "feat: therapist index and profile pages with Person schema"
```

---

### Task 12: Workshops pages (index + detail)

**Files:**
- Create: `src/pages/workshops/index.astro`, `src/pages/workshops/[slug].astro`

**Interfaces:**
- Consumes: `workshops` collection, `WorkshopCard`, `StatusBadge`, `workshopSignupMessage`, `whatsappLink`.
- Produces: `/workshops/`, `/workshops/[id]/`; sorting = open (soonest first) → full → past (newest first).

- [ ] **Step 1: `src/pages/workshops/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import WorkshopCard from "../../components/cards/WorkshopCard.astro";

const rank = { open: 0, full: 1, past: 2 } as const;
const workshops = (await getCollection("workshops")).sort((a, b) => {
  if (rank[a.data.status] !== rank[b.data.status]) return rank[a.data.status] - rank[b.data.status];
  const [x, y] = [a.data.startDate.valueOf(), b.data.startDate.valueOf()];
  return a.data.status === "past" ? y - x : x - y;
});
const upcoming = workshops.filter((w) => w.data.status !== "past");
const past = workshops.filter((w) => w.data.status === "past");
---
<BaseLayout
  title="کارگاه‌ها | پندار نیم رخ"
  description="کارگاه‌های آموزشی روانشناسی در قم — فرزندپروری، مهارت‌های ارتباطی و درمان."
>
  <div class="container-site pt-10">
    <h1 class="text-3xl sm:text-4xl">کارگاه‌های کلینیک</h1>
  </div>
  <section class="container-site section">
    <h2 class="mb-6 text-xl font-bold">در حال ثبت‌نام</h2>
    {upcoming.length === 0 ? (
      <p class="text-ink-muted">در حال حاضر کارگاهی برای ثبت‌نام نیست؛ به‌زودی کارگاه‌های جدید اعلام می‌شود.</p>
    ) : (
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((w) => (
          <WorkshopCard href={`/workshops/${w.id}/`} title={w.data.title} instructor={w.data.instructor} dateDisplay={w.data.dateDisplay} status={w.data.status} />
        ))}
      </div>
    )}
    {past.length > 0 && (
      <div class="mt-14">
        <h2 class="mb-6 text-xl font-bold text-ink-muted">برگزارشده</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {past.map((w) => (
            <WorkshopCard href={`/workshops/${w.id}/`} title={w.data.title} instructor={w.data.instructor} dateDisplay={w.data.dateDisplay} status={w.data.status} />
          ))}
        </div>
      </div>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2: `src/pages/workshops/[slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import StatusBadge from "../../components/StatusBadge.astro";
import Icon from "../../components/Icon.astro";
import { site } from "../../data/site";
import { whatsappLink, workshopSignupMessage, telHref } from "../../utils/links";

export async function getStaticPaths() {
  const workshops = await getCollection("workshops");
  return workshops.map((workshop) => ({
    params: { slug: workshop.id },
    props: { workshop },
  }));
}
const { workshop } = Astro.props;
const { Content } = await render(workshop);
const signupHref =
  workshop.data.status === "open" && site.whatsapp
    ? whatsappLink(site.whatsapp, workshopSignupMessage(workshop.data.title))
    : undefined;
---
<BaseLayout
  title={`${workshop.data.title} | کارگاه‌های پندار نیم رخ`}
  description={`کارگاه «${workshop.data.title}» با مدرسی ${workshop.data.instructor} — ${workshop.data.dateDisplay}، ${workshop.data.location}`}
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: site.url },
        { "@type": "ListItem", position: 2, name: "کارگاه‌ها", item: `${site.url}/workshops/` },
        { "@type": "ListItem", position: 3, name: workshop.data.title },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: workshop.data.title,
      startDate: workshop.data.startDate.toISOString(),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: workshop.data.status === "past" ? undefined : "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: workshop.data.location, address: site.address },
      image: new URL("/og-default.png", site.url).href,
      description: `کارگاه «${workshop.data.title}» با مدرسی ${workshop.data.instructor}`,
      organizer: { "@type": "Organization", name: site.name, url: site.url },
      performer: { "@type": "Person", name: workshop.data.instructor },
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "کارگاه‌ها", href: "/workshops/" }, { label: workshop.data.title }]} />
    <div class="mt-6 max-w-3xl">
      <div class="flex items-center gap-3">
        <StatusBadge status={workshop.data.status} />
        <span class="inline-flex items-center gap-1.5 text-sm text-ink-muted">
          <Icon name="calendar" size={16} /> {workshop.data.dateDisplay} · {workshop.data.time}
        </span>
      </div>
      <h1 class="mt-3 text-3xl sm:text-4xl">{workshop.data.title}</h1>
      <p class="mt-3 text-ink-muted">مدرس: {workshop.data.instructor}</p>
    </div>
  </div>
  <section class="container-site section grid gap-10 lg:grid-cols-[1fr_340px]">
    <article class="prose-fa">
      <Content />
    </article>
    <aside class="card h-fit p-6">
      <h2 class="text-lg font-bold">مشخصات کارگاه</h2>
      <dl class="mt-4 space-y-3 text-sm">
        <div class="flex justify-between gap-4"><dt class="text-ink-muted">زمان</dt><dd>{workshop.data.dateDisplay}، {workshop.data.time}</dd></div>
        <div class="flex justify-between gap-4"><dt class="text-ink-muted">مکان</dt><dd>{workshop.data.location}</dd></div>
        {workshop.data.capacity && (
          <div class="flex justify-between gap-4"><dt class="text-ink-muted">ظرفیت</dt><dd>{workshop.data.capacity} نفر</dd></div>
        )}
        {workshop.data.fee && (
          <div class="flex justify-between gap-4"><dt class="text-ink-muted">شهریه</dt><dd class="font-semibold">{workshop.data.fee}</dd></div>
        )}
      </dl>
      <div class="mt-6">
        {workshop.data.status === "open" && signupHref && (
          <a href={signupHref} target="_blank" rel="noopener" class="btn btn-whatsapp w-full">ثبت‌نام با واتساپ</a>
        )}
        {workshop.data.status === "full" && (
          <p class="rounded-xl bg-status-full-bg px-4 py-3 text-center text-sm font-semibold text-status-full">ظرفیت این کارگاه تکمیل شده است.</p>
        )}
        {workshop.data.status === "past" && (
          <p class="rounded-xl bg-status-past-bg px-4 py-3 text-center text-sm font-semibold text-status-past">این کارگاه برگزار شده است.</p>
        )}
        <a href={telHref(site.phones[0].number)} class="btn btn-secondary mt-3 w-full">تماس برای سؤال</a>
        {workshop.data.registrationNote && (
          <p class="mt-3 text-xs leading-6 text-ink-muted">{workshop.data.registrationNote}</p>
        )}
      </div>
    </aside>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `npm run build && ls dist/workshops/`
Expected: index + 3 workshop directories.

- [ ] **Step 4: Commit**

```bash
git add src/pages/workshops/
git commit -m "feat: workshops index and detail with status-based signup flow"
```

---

### Task 13: Articles pages (index + detail)

**Files:**
- Create: `src/pages/articles/index.astro`, `src/pages/articles/[slug].astro`

**Interfaces:**
- Consumes: `articles` collection (drafts excluded), `ArticleCard`, `readingTimeMinutes`, `articleCovers`.
- Produces: `/articles/`, `/articles/[id]/` with `Article` JSON-LD + share links + related articles.

- [ ] **Step 1: `src/pages/articles/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import SectionHeading from "../../components/SectionHeading.astro";
import ArticleCard from "../../components/cards/ArticleCard.astro";
import { readingTimeMinutes } from "../../utils/readingtime";

const articles = (await getCollection("articles"))
  .filter((a) => !a.data.draft)
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---
<BaseLayout
  title="مقالات | پندار نیم رخ"
  description="مقالات علمی و کاربردی درباره سلامت روان، روابط و فرزندپروری از کلینیک پندار نیم رخ."
>
  <div class="container-site pt-10">
    <h1 class="text-3xl sm:text-4xl">مقالات</h1>
    <p class="mt-3 max-w-2xl text-ink-muted">خواندنی‌هایی برای آگاهی بیشتر درباره سلامت روان.</p>
  </div>
  <section class="container-site section">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard
          id={a.id}
          title={a.data.title}
          description={a.data.description}
          dateDisplay={a.data.dateDisplay}
          category={a.data.category}
          readingTime={readingTimeMinutes(a.body ?? "")}
        />
      ))}
    </div>
  </section>
</BaseLayout>
```

(Design note: the index intentionally renders all non-draft articles on one page. Spec §5.4 pagination is deferred until the clinic publishes more than 12 articles — when needed, switch to Astro's built-in `paginate()` helper; no code change is planned now.)

- [ ] **Step 2: `src/pages/articles/[slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import ArticleCard from "../../components/cards/ArticleCard.astro";
import { site } from "../../data/site";
import { articleCovers } from "../../utils/assets";
import { toPersianDigits } from "../../utils/persian";
import { readingTimeMinutes } from "../../utils/readingtime";

export async function getStaticPaths() {
  const articles = (await getCollection("articles")).filter((a) => !a.data.draft);
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}
const { article } = Astro.props;
const { Content } = await render(article);
const cover = articleCovers[article.id];
const minutes = readingTimeMinutes(article.body ?? "");
const all = (await getCollection("articles")).filter((a) => !a.data.draft && a.id !== article.id);
const related = all
  .filter((a) => a.data.category === article.data.category)
  .concat(all.filter((a) => a.data.category !== article.data.category))
  .slice(0, 3);
const shareText = encodeURIComponent(article.data.title);
const shareUrl = encodeURIComponent(new URL(`/articles/${article.id}/`, site.url).href);
const description = article.data.description;
---
<BaseLayout
  title={`${article.data.title} | مقالات پندار نیم رخ`}
  description={description}
  ogImage={cover?.src}
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.data.title,
      description,
      datePublished: article.data.publishDate.toISOString(),
      dateModified: (article.data.updatedDate ?? article.data.publishDate).toISOString(),
      author: { "@type": "Organization", name: site.name },
      publisher: { "@type": "Organization", name: site.name },
      keywords: article.data.tags.join("، "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: site.url },
        { "@type": "ListItem", position: 2, name: "مقالات", item: `${site.url}/articles/` },
        { "@type": "ListItem", position: 3, name: article.data.title },
      ],
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "مقالات", href: "/articles/" }, { label: article.data.title }]} />
  </div>
  <article class="container-site py-10">
    <header class="mx-auto max-w-3xl">
      <div class="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <span class="badge bg-primary-50 text-primary-700">{article.data.category}</span>
        <span>{article.data.dateDisplay}</span>
        <span aria-hidden="true">·</span>
        <span>{toPersianDigits(minutes)} دقیقه مطالعه</span>
        <span aria-hidden="true">·</span>
        <span>{article.data.author}</span>
      </div>
      <h1 class="mt-4 text-3xl leading-snug sm:text-4xl">{article.data.title}</h1>
      {cover && (
        <img src={cover.src} alt="" width="1200" height="630" loading="eager" class="card mt-8 aspect-[1200/630] w-full object-cover" />
      )}
    </header>

    <div class="prose-fa mx-auto mt-10">
      <Content />
    </div>

    <footer class="mx-auto mt-12 max-w-3xl border-t border-primary-100 pt-6">
      <p class="text-xs leading-6 text-ink-muted">
        این محتوا جنبه اطلاع‌رسانی دارد و جایگزین مشاوره تخصصی نیست. برای بررسی وضعیت خود با کلینیک تماس بگیرید.
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <span class="text-sm font-bold">اشتراک‌گذاری:</span>
        <a class="btn btn-secondary px-3.5 py-2 text-xs" href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener">تلگرام</a>
        <a class="btn btn-whatsapp px-3.5 py-2 text-xs" href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener">واتساپ</a>
      </div>
    </footer>
  </article>

  {related.length > 0 && (
    <section class="section bg-surface" aria-labelledby="related-title">
      <div class="container-site">
        <h2 id="related-title" class="mb-6 text-2xl font-bold">مطالب مرتبط</h2>
        <div class="grid gap-6 md:grid-cols-3">
          {related.map((a) => (
            <ArticleCard
              id={a.id}
              title={a.data.title}
              description={a.data.description}
              dateDisplay={a.data.dateDisplay}
              category={a.data.category}
              readingTime={readingTimeMinutes(a.body ?? "")}
            />
          ))}
        </div>
      </div>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `npm run build && ls dist/articles/`
Expected: index + 2 published articles (the `draft: true` one must NOT exist).

- [ ] **Step 4: Commit**

```bash
git add src/pages/articles/
git commit -m "feat: articles index and detail with Article schema, share links, related posts"
```

---

### Task 14: About + Gallery, FAQ, Contact pages

**Files:**
- Create: `src/pages/about.astro`, `src/pages/faq.astro`, `src/pages/contact.astro`, `src/components/Gallery.astro`, `src/scripts/lightbox.ts`

**Interfaces:**
- Produces: `/about/` (with gallery lightbox), `/faq/` (FAQPage JSON-LD), `/contact/`. Gallery uses eager `import.meta.glob` over `src/assets/gallery/*.svg` and a native `<dialog>` lightbox.

- [ ] **Step 1: `src/components/Gallery.astro`**

```astro
---
const modules = import.meta.glob<{ default: { src: string } }>("../assets/gallery/*.svg", { eager: true });
const photos = Object.entries(modules).map(([path, mod]) => ({
  src: mod.default.src,
  name: path.split("/").pop()!.replace(".svg", ""),
}));
---
<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
  {photos.map((photo, i) => (
    <button
      type="button"
      class="group overflow-hidden rounded-2xl shadow-soft"
      data-lightbox-trigger={photo.src}
      data-lightbox-index={i}
    >
      <img src={photo.src} alt={`تصویر فضای کلینیک — ${photo.name}`} width="800" height="600" loading="lazy" class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
    </button>
  ))}
</div>
<dialog id="lightbox" class="mx-auto my-auto max-w-4xl bg-transparent p-0 backdrop:bg-ink/80" aria-label="نمایش تصویر">
  <div class="relative">
    <img id="lightbox-img" src="" alt="" width="1200" height="900" class="rounded-2xl" />
    <button id="lightbox-close" type="button" class="btn btn-call absolute end-3 top-3 px-3 py-1.5">بستن</button>
  </div>
</dialog>
```

- [ ] **Step 2: `src/scripts/lightbox.ts`**

```ts
import "../scripts/lightbox.css" with { type: "css" }; // NOT used — remove this line; plain CSS below.
```

Do NOT add that import. Final `src/scripts/lightbox.ts`:

```ts
const dialog = document.getElementById("lightbox") as HTMLDialogElement | null;
const img = document.getElementById("lightbox-img") as HTMLImageElement | null;
const closeBtn = document.getElementById("lightbox-close");
const triggers = document.querySelectorAll<HTMLElement>("[data-lightbox-trigger]");
let lastIndex = 0;

function openAt(index: number) {
  if (!dialog || !img) return;
  const trigger = triggers[index];
  if (!trigger) return;
  img.src = trigger.dataset.lightboxTrigger ?? "";
  img.alt = trigger.querySelector("img")?.alt ?? "";
  lastIndex = index;
  dialog.showModal();
  closeBtn?.focus();
}

triggers.forEach((t, i) => t.addEventListener("click", () => openAt(i)));
closeBtn?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
dialog?.addEventListener("keydown", (e) => {
  if (!dialog || !img) return;
  if (e.key === "ArrowLeft") openAt((lastIndex + 1) % triggers.length);
  if (e.key === "ArrowRight") openAt((lastIndex - 1 + triggers.length) % triggers.length);
});
```

- [ ] **Step 3: `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import SectionHeading from "../components/SectionHeading.astro";
import Gallery from "../components/Gallery.astro";
import { site } from "../data/site";
---
<BaseLayout
  title="درباره ما | پندار نیم رخ"
  description="داستان، مأموریت و مجوزهای کلینیک علمی روانشناسی پندار نیم رخ در قم."
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
    <div class="mt-6 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl">درباره کلینیک</h1>
      <p class="mt-4 text-lg leading-8 text-ink-muted">
        کلینیک علمی روانشناسی پندار نیم رخ با هدف ارائه خدمات روانشناختی مبتنی بر شواهد علمی در فضایی امن و محترمانه فعالیت می‌کند. تیم ما از درمانگران دارای پروانه است و سلامت روان مراجعین، اولویت اول ماست.
      </p>
    </div>
  </div>

  <section class="container-site section">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card p-6">
        <h2 class="font-bold text-primary-700">مأموریت ما</h2>
        <p class="mt-2 text-sm leading-7 text-ink-muted">فراهم کردن مراقبت روانی باکیفیت و قابل اعتماد برای هر کسی که قدم اول را برمی‌دارد.</p>
      </div>
      <div class="card p-6">
        <h2 class="font-bold text-primary-700">مجوزها</h2>
        <ul class="mt-2 space-y-1 text-sm text-ink-muted">
          {site.licenses.map((l) => <li>{l.org} — {l.number}</li>)}
        </ul>
      </div>
      <div class="card p-6">
        <h2 class="font-bold text-primary-700">ساعت کاری</h2>
        <ul class="mt-2 space-y-1 text-sm text-ink-muted">
          {site.hours.map((h) => <li>{h.days}: {h.time}</li>)}
        </ul>
      </div>
    </div>
  </section>

  <section class="container-site pb-24" aria-labelledby="gallery-title">
    <SectionHeading eyebrow="گالری" title="فضای کلینیک" lead="محیطی آرام برای مسیر درمان شما" />
    <Gallery />
  </section>
</BaseLayout>
```

- [ ] **Step 4: `src/pages/faq.astro`** — accordion from `<details>` + FAQPage JSON-LD:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import { faqs } from "../data/faq";

const ordered = [...faqs].sort((a, b) => a.order - b.order);
---
<BaseLayout
  title="سؤالات متداول | پندار نیم رخ"
  description="پاسخ پرسش‌های رایج درباره نوبتدهی، هزینه، رازداری و جلسات کلینیک پندار نیم رخ."
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ordered.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "سؤالات متداول" }]} />
    <h1 class="mt-6 text-3xl sm:text-4xl">سؤالات متداول</h1>
  </div>
  <section class="container-site section max-w-3xl">
    {ordered.map((f) => (
      <details class="card group mb-3 p-5">
        <summary class="cursor-pointer list-none font-bold marker:hidden">
          <span class="flex items-center justify-between gap-4">
            {f.question}
            <span aria-hidden="true" class="text-primary-600 transition-transform group-open:rotate-45">+</span>
          </span>
        </summary>
        <p class="mt-3 text-sm leading-7 text-ink-muted">{f.answer}</p>
      </details>
    ))}
  </section>
</BaseLayout>
```

- [ ] **Step 5: `src/pages/contact.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import ContactChannels from "../components/ContactChannels.astro";
import HoursTable from "../components/HoursTable.astro";
import CrisisStrip from "../components/CrisisStrip.astro";
import Icon from "../components/Icon.astro";
import { site } from "../data/site";
---
<BaseLayout
  title="تماس و نوبتدهی | پندار نیم رخ"
  description="تماس با کلینیک علمی روانشناسی پندار نیم رخ: تلفن، واتساپ، نشانی و ساعت کاری."
  jsonLd={[
    {
      "@context": "https://schema.org",
      "@type": "Psychologist",
      name: site.name,
      url: site.url,
      telephone: site.phones[0].number,
      address: { "@type": "PostalAddress", addressLocality: "قم", addressCountry: "IR", streetAddress: site.address },
      openingHours: "Sa-We 16:00-21:00 Th 09:00-13:00",
    },
  ]}
>
  <div class="container-site pt-10">
    <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "تماس و نوبتدهی" }]} />
    <div class="mt-6 max-w-2xl">
      <h1 class="text-3xl sm:text-4xl">تماس و نوبتدهی</h1>
      <p class="mt-3 text-ink-muted">
        برای رزرو نوبت، پرسش درباره خدمات یا ثبت‌نام کارگاه‌ها از هر راهی که برای شما راحت‌تر است تماس بگیرید.
      </p>
      <p class="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm leading-6 text-primary-800">
        همه تماس‌ها و پیام‌ها کاملاً محرمانه بررسی می‌شوند. اطلاعات شما در اختیار هیچ شخص ثالثی قرار نمی‌گیرد.
      </p>
    </div>
  </div>

  <section class="container-site section grid gap-10 lg:grid-cols-2">
    <div class="card p-6">
      <h2 class="text-lg font-bold">راه‌های ارتباطی</h2>
      <div class="mt-4">
        <ContactChannels />
      </div>
      <div class="mt-6 space-y-3 text-sm">
        {site.phones.map((p) => (
          <p class="flex items-center gap-2 text-ink-muted">
            <span class="text-primary-600"><Icon name="phone" size={16} /></span>
            <span>{p.label}:</span>
            <bdi class="font-semibold text-ink">{p.number}</bdi>
          </p>
        ))}
        <p class="flex items-start gap-2 text-ink-muted">
          <span class="mt-0.5 text-primary-600"><Icon name="map" size={16} /></span>
          <span>{site.address}</span>
        </p>
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <a class="btn btn-secondary px-3.5 py-2 text-xs" href={site.maps.neshan} target="_blank" rel="noopener">نمایش در نشان</a>
        <a class="btn btn-secondary px-3.5 py-2 text-xs" href={site.maps.balad} target="_blank" rel="noopener">نمایش در بلد</a>
        <a class="btn btn-secondary px-3.5 py-2 text-xs" href={site.maps.google} target="_blank" rel="noopener">Google Maps</a>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-bold">ساعت کاری</h2>
      <div class="mt-4">
        <HoursTable title="برنامه پاسخگویی" />
      </div>
    </div>
  </section>

  <CrisisStrip />
</BaseLayout>
```

- [ ] **Step 6: Register the lightbox script** — in `src/layouts/BaseLayout.astro`, add to the script block:

```astro
    <script>
      import "../scripts/menu";
      import "../scripts/reveal";
      import "../scripts/lightbox";
    </script>
```

(The script no-ops on pages without gallery triggers.)

- [ ] **Step 7: Verify**

Run: `npm run build && npm run preview` — check in browser:
- `/about/`: gallery opens in lightbox; Esc closes; arrows navigate; focus returns.
- `/faq/`: accordions open/close with keyboard; `+` rotates.
- `/contact/`: all channels render (واتساپ، تماس، تلگرام، اینستاگرام، ایتا، بله); map links open correct services; crisis strip visible.
Expected: all true.

- [ ] **Step 8: Commit**

```bash
git add src/pages/about.astro src/pages/faq.astro src/pages/contact.astro src/components/Gallery.astro src/scripts/lightbox.ts src/layouts/BaseLayout.astro
git commit -m "feat: about with gallery lightbox, FAQ accordion with FAQPage schema, contact page"
```

---

### Task 15: 404, robots.txt, OG image, sitemap

**Files:**
- Create: `src/pages/404.astro`, `public/robots.txt`, `public/og-default.png` (binary asset)

**Interfaces:**
- Consumes: sitemap integration (Task 1). Produces: `/404.html`, `/robots.txt`, `/og-default.png`, `/sitemap-index.xml`.

- [ ] **Step 1: `src/pages/404.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="صفحه پیدا نشد | پندار نیم رخ" description="صفحه موردنظر یافت نشد.">
  <div class="container-site section text-center">
    <p class="eyebrow">۴۰۴</p>
    <h1 class="mt-2 text-3xl">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
    <p class="mt-3 text-ink-muted">شاید نشانی تغییر کرده باشد.</p>
    <div class="mt-8 flex justify-center gap-3">
      <a href="/" class="btn btn-primary">خانه</a>
      <a href="/services/" class="btn btn-secondary">خدمات</a>
      <a href="/contact/" class="btn btn-secondary">تماس</a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://pendarqom.ir/sitemap-index.xml
```

- [ ] **Step 3: `public/og-default.png`** — 1200×630 clinic-branded OG image (sage/cream palette, clinic Persian name, subtle organic shapes). Generate once during implementation (any available image tool) and save to `public/og-default.png`. If the generated image's Persian text renders incorrectly, fall back to a clean text-free branded graphic. Verify file size ≤ 200KB.

- [ ] **Step 4: Verify**

Run: `npm run build && ls dist/robots.txt dist/og-default.png dist/sitemap-index.xml dist/404.html && grep -c "<url>" dist/sitemap-index.xml`
Expected: all files exist; sitemap has `<url>` entries for all pages.

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro public/
git commit -m "feat: 404 page, robots.txt, OG image, sitemap wiring"
```

---

### Task 16: Strict launch guard

**Files:**
- Create: `scripts/check-placeholders.mjs`, `.github/workflows/launch-check.yml`, `docs/content-todo.md`
- Modify: (no change needed — `build:launch` script already in package.json from Task 1)

**Interfaces:**
- Produces: `npm run build:launch` (fails if placeholder/draft content remains) + manually-triggered CI check. Exit 0 = launch-ready.

- [ ] **Step 1: Verify the guard FAILS now (TDD)**

Run: `npm run build:launch`
Expected: FAIL (exit 1) listing placeholder files — because all seeded content is `placeholder: true`.

- [ ] **Step 2: Create `scripts/check-placeholders.mjs`**

```js
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const roots = [
  "src/content/services",
  "src/content/therapists",
  "src/content/workshops",
  "src/content/articles",
];
const dataFiles = ["src/data/testimonials.ts", "src/data/faq.ts", "src/data/site.ts"];

const patterns = [/^placeholder:\s*true/m, /^draft:\s*true/m, /placeholder:\s*true/];
const offenders = [];

function scanFile(path, content, patternsForFile) {
  if (patternsForFile.some((p) => p.test(content))) offenders.push(path);
}

for (const root of roots) {
  for (const file of readdirSync(root)) {
    if (!file.endsWith(".md")) continue;
    const path = join(root, file);
    scanFile(path, readFileSync(path, "utf8"), patterns.slice(0, 2));
  }
}
for (const path of dataFiles) {
  scanFile(path, readFileSync(path, "utf8"), [patterns[2]]);
}

if (offenders.length > 0) {
  console.error("✖_LAUNCH BLOCKED — placeholder/draft content remains in:\n");
  for (const o of offenders) console.error("  - " + o);
  console.error(
    "\nReplace or remove placeholder:true / draft:true frontmatter, then re-run: npm run build:launch",
  );
  process.exit(1);
}
console.log("✔ No placeholder or draft content remaining. Launch build may proceed.");
```

- [ ] **Step 3: Re-verify**

Run: `npm run build:launch`
Expected: FAIL with the exact file list (all 16 seeded files + site.ts). This is the desired pre-launch behavior.

- [ ] **Step 4: Create `.github/workflows/launch-check.yml`**

```yaml
name: Launch Check
on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  launch-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build:launch
      - run: npm run check
      - run: npm test
```

- [ ] **Step 5: Create `docs/content-todo.md`** — the replacement checklist:

```markdown
# محتوای نمونه — چک‌لیست جایگزینی پیش از انتشار

Before public announcement, replace ALL of the following and make `npm run build:launch` pass:

- [ ] `src/data/site.ts` — phones, whatsapp, address, maps links, hours, license numbers (real)
- [ ] `src/data/testimonials.ts` — real quotes with written consent (or delete entries)
- [ ] All `src/content/services/*.md` — real descriptions (`placeholder: false`)
- [ ] All `src/content/therapists/*.md` — real names, licenses, bios, photos (JPEG/PNG via astro:assets) (`placeholder: false`)
- [ ] All `src/content/workshops/*.md` — real first workshops or delete (`placeholder: false`)
- [ ] `src/content/articles/*.md` — real articles or remove files (`draft: true` files: publish or delete)
- [ ] `src/assets/gallery/*.svg` — real clinic photos
- [ ] `src/assets/therapists/*.svg`, `src/assets/articles/*.svg` — real photos
- [ ] Confirm crisis line numbers (۱۴۸۰، ۱۲۳) with the clinic
- [ ] Confirm eNAMAD/registrar compliance (spec §12)
```

- [ ] **Step 6: Commit**

```bash
git add scripts/check-placeholders.mjs .github/workflows/launch-check.yml docs/content-todo.md
git commit -m "feat: strict launch guard — build fails while placeholder content remains"
```

---

### Task 17: CI deploy workflow, CNAME, documentation

**Files:**
- Create: `.github/workflows/deploy.yml`, `public/CNAME`, `README.md`, `docs/dev.md`, `docs/maintenance.md`

**Interfaces:**
- Produces: automatic deploy on push to `main` (verified action versions), custom-domain pin, contributor docs.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`** (exact YAML from Astro docs, verified 2026-10-14)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Create `public/CNAME`**

```
pendarqom.ir
```

- [ ] **Step 3: Create `README.md`** — brief: what the project is, pointers to `docs/dev.md` and `docs/maintenance.md`, spec + plan paths.

- [ ] **Step 4: Create `docs/dev.md`**

```markdown
# توسعه محلی

پیش‌نیاز: Node.js ≥ 22.12

- `npm install` — نصب وابستگی‌ها
- `npm run dev` — اجرای محلی روی http://localhost:4321
- `npm run build` — بیلد تولیدی در `dist/`
- `npm run preview` — پیش‌نمایش خروجی بیلد
- `npm run check` — بررسی تایپ‌ها
- `npm test` — تست‌های واحد
- `npm run build:launch` — بیلد سخت‌گیرانه (اگر محتوای نمونه مانده باشد شکست می‌خورد)

استقرار: هر push به `main` به‌صورت خودکار ساخته و منتشر می‌شود (GitHub Actions).
```

- [ ] **Step 5: Create `docs/maintenance.md`** — Persian, task-oriented:

```markdown
# به‌روزرسانی محتوا

## افزودن کارگاه جدید
1. فایل جدید در `src/content/workshops/` (کپی از یک کارگاه موجود)
2. پر کردن frontmatter: `title, instructor, startDate (ISO), dateDisplay (میلادی به شمسی نوشته شده), time, location, capacity, fee, status`
3. `status` یکی از `open` / `full` / `past`
4. commit و push — یک دقیقه بعد سایت به‌روز است

## به‌روزرسانی اطلاعات تماس یا ساعت کاری
فقط `src/data/site.ts` را ویرایش کنید — در همه صفحات اعمال می‌شود.

## انتشار مقاله
فایل جدید در `src/content/articles/`؛ برای پیش‌نویس `draft: true` بگذارید.

## آرشیو کارگاه گذشته
`status: "past"` و به‌روزرسانی `dateDisplay`/`startDate`.

## جایگزینی تصاویر نمونه
عکس واقعی (JPG/PNG) را جایگزین SVG کنید؛ برای عملکرد بهتر از `<Image>` در astro:assets استفاده کنید.
```

- [ ] **Step 6: Verify CI locally (dry-run the build)**

Run: `npm run check && npm test && npm run build`
Expected: all green (this is exactly what `withastro/action` runs).

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/deploy.yml public/CNAME README.md docs/dev.md docs/maintenance.md
git commit -m "feat: GitHub Actions deploy workflow, CNAME, contributor docs"
```

---

### Task 18: Performance & accessibility verification pass

**Files:**
- Modify: whatever the audits surface (likely `src/styles/global.css`, `src/layouts/BaseLayout.astro`, image attrs)
- Create: `docs/launch-checklist.md` (filled from spec §11 with results)

**Interfaces:**
- Consumes: built site. Produces: documented audit results; fixes folded in.

- [ ] **Step 1: Build + serve**

Run: `npm run build && npm run preview`

- [ ] **Step 2: Lighthouse (mobile emulation) on `/`, `/services/`, `/workshops/`, `/articles/`**

Run: `npx lighthouse http://localhost:4321/ --preset=perf --form-factor=mobile --quiet --chrome-flags="--headless"` (repeat per route)
Expected: Perf ≥ 95, A11y ≥ 95 (goal 100), SEO ≥ 95, BP ≥ 95. Fix and re-run until met; record numbers in `docs/launch-checklist.md`.

- [ ] **Step 3: Budget check on home page**

Run: `du -sh dist/ && find dist/_astro -name "*.css" | xargs du -ch | tail -1 && find dist -name "*.js" | xargs du -ch | tail -1`
Expected: total JS ≤ 15KB, CSS ≤ 50KB, first-view (HTML+CSS+JS+fonts) ≤ 400KB. Fonts: verify Vazirmatn woff2 subsets load ≤ 150KB total.

- [ ] **Step 4: Keyboard + a11y spot pass (documented in checklist)**

Manual, in browser: skip-link first Tab; drawer focus trap + Esc; accordion; lightbox; visible focus rings; VoiceOver reads home + contact sensibly (landmarks, links labeled).
Expected: all pass; fix anything that doesn't.

- [ ] **Step 5: Zero-third-party check**

Run: `grep -rEoh "https?://[^\"]*" dist/index.html dist/_astro/*.css | grep -v "pendarqom.ir" | grep -vE "schema.org|ogp.me|twitter.com|w3.org" || echo CLEAN`
Expected: `CLEAN` (only spec-namespace URLs remain).

- [ ] **Step 6: Structured data validation**

Verify structured data locally: `npm run build && grep -o '"@type":"[^"]*"' dist/services/index.html | sort -u` (and repeat for a therapist, workshop, article, FAQ page). Expected: JSON-LD blocks parse and `Psychologist`, `Person`, `Article`, `FAQPage`, `BreadcrumbList`, `Event` appear on the right pages. Before go-live (Task 19), run deployed URLs through Google Rich Results Test (https://search.google.com/test/rich-results) and validator.schema.org.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: performance and accessibility pass — audit results recorded"
```

---

### Task 19: Go-live — DNS, Pages settings, final verification (owner actions + verification)

**Files:**
- Create: `docs/golive.md` (runbook below, with checkboxes the owner ticks)
- Modify: none (owner performs registrar/GitHub UI steps)

**Interfaces:**
- Produces: live site at https://pendarqom.ir over HTTPS.

- [ ] **Step 1: Write `docs/golive.md` with exact steps (owner executes):**

```markdown
# راهنمای راه‌اندازی (یک‌بار)

## ۱. تنظیم DNS در پنل دامنه (ir)
| نوع | هاست | مقدار |
|-----|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | raya-mansouri.github.io |

اگر پنل فقط تغییر NameServer می‌دهد: DNS را به یک سرویس رایگان (مثل Cloudflare) بسپارید و رکوردها را آنجا بسازید.

## ۲. تنظیمات GitHub Pages
- Settings → Pages → Build and deployment → Source: **GitHub Actions**
- Settings → Pages → Custom domain: `pendarqom.ir` → Save
- بعد از صدور گواهی: تیک **Enforce HTTPS** را بزنید

## ۳. تأیید نهایی
- https://pendarqom.ir باز می‌شود و قفل سبز دارد
- http://pendarqom.ir به https منتقل می‌شود
- www.pendarqom.ir به دامنه اصلی منتقل می‌شود
- `curl -sI https://pendarqom.ir | head -5` → HTTP/2 200
```

- [ ] **Step 2: Owner performs DNS + Pages steps** (executor waits; DNS propagation may take minutes–hours; cert issuance after that).

- [ ] **Step 3: Verification (executor, once DNS resolves)**

Run: `dig +short pendarqom.ir A | sort` and `curl -sIL http://pendarqom.ir | grep -E "HTTP|location"` and `curl -sIL https://www.pendarqom.ir | grep -E "HTTP|location"`
Expected: the four 185.199.x IPs; http→https redirect; www→apex; final 200 over HTTPS.

- [ ] **Step 4: Post-deploy checklist from spec §11** — walk the owner through: real-phone `tel:`/WhatsApp tests, Telegram/WhatsApp link-preview check of the OG image, submit sitemap in Google Search Console (`https://pendarqom.ir/sitemap-index.xml`), verify `build:launch` state (site may stay in placeholder mode until real content arrives — public announcement waits for Task-16 checklist completion).

- [ ] **Step 5: Commit**

```bash
git add docs/golive.md
git commit -m "docs: go-live runbook"
```

