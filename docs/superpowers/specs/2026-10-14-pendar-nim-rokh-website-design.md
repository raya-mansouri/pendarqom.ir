# کلینیک علمی روانشناسی پندار نیم رخ — Website Design Spec

- **Date:** 2026-10-14
- **Status:** Approved (design rounds 1–3 confirmed by owner)
- **Domain:** pendarqom.ir
- **Hosting:** GitHub Pages (public repo, GitHub Actions deploy)

---

## 1. Overview & Goals

A Persian-language (RTL), static marketing and information website for کلینیک علمی روانشناسی پندار نیم رخ.

**Goals, in priority order:**

1. **Trust** — a calm, professional, credible presence matching the clinic's «علمی» (scientific) identity; credentials and licenses visible.
2. **Conversion** — every page leads to a low-friction contact action (call / WhatsApp). No backend, no forms.
3. **Findability** — rank for local Persian searches (e.g., «زوج درمانی در قم», «روانشناس کودک قم») via per-service/therapist/article pages and structured data.
4. **Maintainability** — content lives in Markdown files; updating a workshop or therapist never touches layout code.
5. **Performance** — near-instant loads on Iranian mobile networks; zero third-party runtime requests.

**Explicitly out of scope (v1):** online booking/calendar, payments, user accounts, newsletter, live chat, comments, multi-language, dark mode, analytics. (See §14 Future Options.)

---

## 2. Decisions Log

| # | Decision | Choice |
|---|----------|--------|
| 1 | Languages | Persian only, RTL (`lang="fa" dir="rtl"`) |
| 2 | Booking model | Contact links only: `tel:`, WhatsApp deep links, social DMs |
| 3 | Initial content | Mostly placeholders, clearly marked, with a strict launch guard (§6.3) |
| 4 | Maintainer | Owner/developer edits Markdown + pushes; AI-assisted editing expected |
| 5 | Sections | Home, Services, Therapists, Workshops, Articles, About+Gallery, FAQ, Contact, 404 |
| 6 | Visual mood | «Calm & natural» — sage/teal, warm cream, generous whitespace |
| 7 | Tech | Astro 5 + Tailwind CSS 4, static output, Zod-validated content collections |
| 8 | Font | Vazirmatn Variable, self-hosted, subsetted |
| 9 | Contact channels | Phone, WhatsApp, Instagram, Telegram, Eitaa, Bale |
| 10 | Crisis lines | Yes — national crisis-support numbers in footer |
| 11 | Therapist profiles | Individual pages per therapist (`/therapists/[slug]`) |
| 12 | Analytics | None (privacy-first; zero third-party requests) |
| 13 | Repo | Public GitHub repo (free Pages) |
| 14 | Deployment | GitHub Actions → GitHub Pages, custom apex domain + HTTPS |

---

## 3. Audience & Success Criteria

**Primary audiences:**

- Individuals/families in Qom and Persian-speaking Iran seeking therapy (anxiety, depression, couples, child/adolescent, grief, etc.).
- Referral sources: physicians, schools, other clinicians.
- Workshop seekers (parents, couples, professionals).

**Success criteria (6 months post-launch, qualitative + measurable):**

- All primary pages pass Lighthouse budgets (§10) on mobile.
- Site is indexed in Google for the clinic name and at least several service+city queries.
- Contact actions (tap-to-call/WhatsApp) reachable in ≤ 2 taps from any page.
- Content owner can add a workshop by editing one Markdown file, verified end-to-end.

---

## 4. Site Structure

### 4.1 Sitemap

```
/                       خانه
├── /services           خدمات (overview, grouped by category)
│   └── /services/[slug]
├── /therapists         درمانگران (team grid)
│   └── /therapists/[slug]
├── /workshops          کارگاهها (upcoming + past)
│   └── /workshops/[slug]
├── /articles           مقالات (index, categories)
│   └── /articles/[slug]
├── /about              درباره ما (story, licenses, گالری، برنامه کاری)
├── /faq                سؤالات متداول
├── /contact            تماس و نوبتدهی
└── /404
```

Service categories (enum): فردی، زوج و خانواده، کودک و نوجوان، گروهدرمانی، ارزیابی و تست، آموزش و کارگاه.

### 4.2 Page specifications

**خانه (Home)** — sections in order:

1. Hero: clinic name, one-line promise, primary CTA (تماس/رزرو نوبت → `tel:`), secondary CTA (واتساپ). Trust strip: license number(s), years active, sessions delivered (values from `site.ts`, placeholder-marked).
2. خدمات — 6 service cards (icon, title, one-line summary) → `/services`.
3. چرا ما (proficiency) — 3–4 differentiators: licensed therapists (پروانهدار), evidence-based approaches (رویکردهای علمی/CBT…), confidentiality (رازداری), child-friendly space… *(final copy from clinic)*.
4. درمانگران — 3–4 featured therapist cards → `/therapists`.
5. کارگاهها — next 3 upcoming workshops with status badges.
6. نظرات مراجعین — 3–4 anonymized testimonials.
7. مقالات — latest 3 articles.
8. نوار تماس — phone, WhatsApp, hours summary, address. Crisis lines appear in the footer site-wide (plus a callout on the Contact page).

**خدمات (Services index):** grouped by category; each card → detail page.

**Service detail:** title, summary, suitable-for list, approach, session format/duration (if provided), therapist(s) offering it, CTA to contact. Persian SEO copy.

**درمانگران (Team):** grid of cards (photo, name, title, specialty tags, 1-line bio) with featured-first ordering.

**Therapist profile:** photo, full name, title, license number (شماره پروانه), specialties, approaches (CBT/ACT/…), education & certifications, languages, session info, CTA (رزرو نوبت با ایشان → WhatsApp prefilled message).

**کارگاهها (Workshops):** upcoming list (sorted by date), then past (archived, visually muted). Card: title, Persian date (۱۴۰۴/…), instructor, location, status badge.

**Workshop detail:** description, instructor (link to profile), date/time (Persian display), location, capacity, fee (optional), registration note, CTA: WhatsApp with prefilled message (e.g. «سلام، برای کارگاه [عنوان] ثبتنام میکنم») or call.

**مقالات (Articles index):** grid with cover, category, reading time, Persian date; newest first.

**Article detail:** clean reading layout (max ~70ch), published/updated dates, author, related articles, share buttons (Telegram/WhatsApp/کپی لینک).

**درباره ما (About):** clinic story, mission, license numbers, گالری (photo grid + lightbox), location/hours summary.

**سؤالات متداول (FAQ):** accordion grouped: نوبتدهی، هزینه و بیمه، رازداری، جلسات و رویکردها، کودکان و نوجوانان. Content seeded with 6–8 items, clinic-editable.

**تماس (Contact):** all channels as prominent buttons (tel، واتساپ، اینستاگرام، تلگرام، ایتا، بله — only rendered if configured), working-hours table, address + deep links to نشان / بلد / Google Maps (**no embedded map iframe**: slow/blocked in Iran), confidentiality note, crisis-lines callout.

**404:** friendly Persian message + links to خانه/خدمات/تماس.

### 4.3 Navigation

- **Header (sticky):** logo/wordmark → خانه · خدمات · درمانگران · کارگاهها · مقالات · درباره ما · تماس + CTA button «رزرو نوبت» (`tel:`). Mobile: slide-in drawer, keyboard-accessible.
- **Footer:** quick links, contact summary, working hours, license number(s), crisis-lines strip, socials, copyright (Persian numerals year).
- **Breadcrumbs** on all inner pages (with `BreadcrumbList` JSON-LD).

### 4.4 User flows

1. **Book a session:** any CTA → `tel:` or `wa.me` deep link. ≤ 2 taps from any page.
2. **Choose a therapist:** service detail → «درمانگران این خدمت» → profile → WhatsApp prefilled CTA.
3. **Register for a workshop:** workshops → detail → WhatsApp prefilled with workshop title.
4. **Read & return:** article → related articles → Instagram follow (no newsletter in v1).

---

## 5. Design System

### 5.1 Color tokens

| Token | Value | Use |
|-------|-------|-----|
| `bg` | `#FAF8F4` | Page background (warm cream) |
| `surface` | `#FFFFFF` | Cards, panels |
| `ink` | `#22302B` | Primary text |
| `ink-muted` | `#5C6B64` | Secondary text (≥ 4.5:1 on bg) |
| `primary-50…900` | `#F0F6F3, #DCEAE4, #BBD6CC, #93BCAE, #6B9E8D, **#4E8474**, **#3C6B5E**, #2F564C, #264741, #1F3A35` | Sage-teal ramp; 600 = primary action |
| `accent-clay` | `#8C5A3C` | Rare warm accent (hover, small badges) |
| `status-open` | `#2E7D4F` on `#E6F4EC` | ثبتنام باز |
| `status-full` | `#9A6B1F` on `#FBF3E0` | تکمیل / ظرفیت پر |
| `status-past` | `#5C6B64` on `#EEF1EF` | برگزارشده |

Contrast: body text ≥ 4.5:1, large text/UI ≥ 3:1 (WCAG 2.1 AA). All token pairs verified during implementation.

### 5.2 Typography

- **Family:** Vazirmatn Variable (`@fontsource-variable/vazirmatn` with unicode-range subsets), self-hosted, preloaded. Fallback stack: `Vazirmatn, "Segoe UI", Tahoma, system-ui, sans-serif`.
- **Sizes:** base 17px; body line-height 1.9; headings line-height 1.4. Scale: h1 `clamp(2rem, 5vw, 3.25rem)`, h2 `clamp(1.5rem, 3.5vw, 2.25rem)`, h3 `1.25rem`, small `0.875rem`.
- **Weights:** 400 body، 500 UI labels، 700–800 headings.
- **Numerals:** Persian digits (۰-۹) for dates, counts, fees via `toPersianDigits()`; Latin digits only inside `tel:` / `wa.me` hrefs (technical requirement).

### 5.3 Shape, spacing, motion

- Radius: cards 16px, buttons/inputs 12px, badges pill.
- Shadows: soft, green-tinted (`0 10px 30px rgb(34 48 43 / 0.08)`).
- Spacing: 4px base scale; section vertical padding `clamp(4rem, 8vw, 7rem)`; content max-width ~72rem.
- Motion: fade-up on scroll (IntersectionObserver, 300–450ms ease-out), subtle card hover lift. All motion disabled under `prefers-reduced-motion: reduce`. No parallax, no autoplaying carousels.

### 5.4 Component inventory

Header (sticky, scroll state, drawer) · Footer (incl. crisis strip) · Button variants (primary/secondary/ghost/call/WhatsApp) · Card: Service, Therapist, Workshop, Article, Testimonial · WorkshopStatus badge · CategoryTag · FAQ accordion (native `<details>` enhanced) · Gallery grid + lightbox · Breadcrumbs · ContactChannel buttons · HoursTable · CTA strip · Prose (article) styles · SEO head (meta + JSON-LD) · Skip link.

### 5.5 Imagery

- **Placeholders:** locally generated calm abstract/gradient images (no external placeholder services — blocked/slow in Iran). Clearly tracked for replacement.
- **Photo guideline (for real photos):** soft natural light, plants/warm neutrals, real clinic spaces, avoid stock clichés (no handshakes); therapist portraits: neutral background, friendly, consistent crop (square, face-centered). Explicit permission required for any client imagery.

---

## 6. Content Model

### 6.1 Collections (Markdown + Zod schemas; invalid content fails the build)

**`services/*.md`** — `title, slug, category (enum), summary, icon, order, placeholder: bool` + body.
Seed: 6 services covering all categories.

**`therapists/*.md`** — `name, photo, title, licenseNumber, specialties[], approaches[], education[], languages[], order, featured, placeholder` + body.
Seed: 4 therapists (placeholder: true).

**`workshops/*.md`** — `title, instructor, startDate (ISO), dateDisplay (Persian string), time, location, capacity?, fee?, status (open|full|past), registrationNote?, placeholder` + body.
Seed: 3 workshops (1 open, 1 full, 1 past).

**`articles/*.md`** — `title, description, publishDate, updatedDate?, cover, author, category, tags[], draft, placeholder` + body. Reading time computed automatically.
Seed: 3 articles (draft or placeholder).

### 6.2 Data files (short/repeating items)

- `src/data/site.ts` — **single source of truth**: `clinicName, tagline, phones[], whatsapp, instagram, telegram, eitea, bale, email?, address, mapLinks{neshan,balad,google}, hours[], licenses[], crisisLines[], foundedYear`. Channel UI renders only configured entries.
- `src/data/testimonials.ts` — `quote, attribution (initial + context e.g. «م.، مراجع زوجدرمانی»), consent: bool, placeholder`.
- `src/data/faq.ts` — `question, answer, category, order`.

### 6.3 Placeholder policy + strict launch guard

- Every placeholder item carries `placeholder: true` (or `draft: true` for articles).
- Placeholders render normally in development/preview (they look real enough to design against) but **are never acceptable for public launch**.
- **Guard 1 (local):** `npm run build:launch` — fails with a listing of all files still marked placeholder/draft.
- **Guard 2 (CI):** manually-triggered `launch-check` GitHub Actions workflow runs the same check.
- `docs/content-todo.md` — checklist of every placeholder + what real data is needed. Checklist items map 1:1 to `placeholder: true` files.

### 6.4 Update workflow (the "low-code" layer)

Edit Markdown → commit → push → GitHub Actions rebuilds + deploys (~1 min). Documented in `docs/maintenance.md` with worked examples (add a workshop, update hours, publish an article, archive a past workshop).

---

## 7. Technical Architecture

### 7.1 Stack

- **Astro 5** — static output, zero client framework.
- **Tailwind CSS 4** (@tailwindcss/vite) — design tokens as CSS variables + utility classes with logical properties for RTL.
- **@fontsource-variable/vazirmatn** — self-hosted font.
- **@astrojs/sitemap** — sitemap.xml.
- **Vanilla JS only** (≤ 15KB gzipped total): drawer, accordion enhancement, lightbox, scroll animations, header scroll state.
- **@astrojs/check** — type checking in CI.

### 7.2 Repository layout

```
pendarqom.ir/
├── .github/workflows/deploy.yml        # build + deploy to Pages
├── .github/workflows/launch-check.yml  # manual strict placeholder check
├── docs/
│   ├── dev.md                          # local development
│   ├── maintenance.md                  # how to update content
│   ├── content-todo.md                 # placeholders → real content checklist
│   └── superpowers/specs/              # this spec
├── public/
│   ├── CNAME                           # pendarqom.ir
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png
│   ├── og-default.png (1200×630)
│   └── fonts/ (fallback copies if needed)
├── src/
│   ├── data/ {site.ts, testimonials.ts, faq.ts}
│   ├── content/ {services, therapists, workshops, articles}
│   ├── content.config.ts               # collection schemas
│   ├── components/ (see §5.4)
│   ├── layouts/BaseLayout.astro        # head/SEO/JSON-LD/skip-link
│   ├── pages/ (see §4.1 + og/rss if added later)
│   ├── scripts/ (menu.ts, animations.ts, lightbox.ts)
│   ├── styles/global.css               # tokens + prose styles
│   └── utils/ (toPersianDigits, date formatting, seo helpers)
├── astro.config.mjs                    # site: https://pendarqom.ir
├── package.json                        # build / build:launch / check / dev scripts
└── README.md
```

### 7.3 Routing & rendering

All routes pre-rendered at build time to static HTML. Dynamic routes via `getStaticPaths()` from content collections. No SSR, no API routes, no environment secrets.

### 7.4 Error handling

- Invalid collection frontmatter → build fails with file path + field error (Zod).
- Broken internal links → caught in launch checklist (§11) via link check pass on built output.
- External runtime failures: none possible by design (zero third-party requests).
- 404 page for unknown routes (GitHub Pages serves `404.html`).

---

## 8. SEO & Structured Data

- `lang="fa" dir="rtl"`; unique `<title>`/`description` per page (Persian, template-driven); canonical URLs; `sitemap.xml`; `robots.txt` (allow all, sitemap ref).
- OG/Twitter meta; default OG image (clinic branding 1200×630); article covers used as OG when present. Telegram/WhatsApp link previews must render correctly (verified in checklist).
- JSON-LD:
  - Home + Contact: `Psychologist` (full address, geo coordinates, `openingHoursSpecification`, `telephone`, image, sameAs socials).
  - Therapist profiles: `Person` (+ `worksFor`).
  - Articles: `Article` (+ author, dates).
  - FAQ: `FAQPage`.
  - All inner pages: `BreadcrumbList`.
  - Workshops: `Course`-style `Event` (optional, only if data complete).
- Persian content strategy: article titles target practical queries (e.g. «علائم اضطراب در نوجوانان»); service pages target «[خدمت] در قم».

---

## 9. Accessibility (target: WCAG 2.1 AA)

- Semantic landmarks (`header/nav/main/footer`), one `h1` per page, logical heading order.
- Skip-to-content link as first focusable element.
- Visible focus styles (2px ring, `primary-600`, offset) on all interactive elements.
- Full keyboard operability: drawer (focus trap + Esc), accordion, lightbox (Esc, arrows, focus return).
- Contrast verified per §5.1; `alt` text mandatory on all content images (required prop in components).
- `prefers-reduced-motion` honored globally.
- Form-free design removes a whole class of a11y risk. Screen-reader spot check (VoiceOver) in launch checklist.

---

## 10. Performance Budget

| Metric | Target | Verification |
|--------|--------|--------------|
| Lighthouse mobile | Perf ≥ 95 · A11y → 100 · Best Practices ≥ 95 · SEO ≥ 95 | Lighthouse on deployed URL, throttled |
| LCP / CLS / INP | ≤ 2.0s · ≤ 0.05 · ≤ 200ms | Lighthouse mobile / local field feel on 4G |
| First view weight | ≤ 400KB (HTML+CSS+JS+fonts) | DevTools network, cold cache |
| Hero image | ≤ 150KB AVIF (WebP fallback) | `astro:assets`, explicit dimensions |
| Fonts | ≤ 150KB total, woff2 subsets, `font-display: swap`, preloaded | Network panel |
| Runtime third-party requests | **0** | Network panel |
| JS | ≤ 15KB gzipped | Build report |
| CSS | ≤ 50KB gzipped | Build report |

Rules: images via `astro:assets` (AVIF/WebP, lazy below fold, width/height set); no render-blocking resources; fonts preloaded; animations CSS-only where possible.

---

## 11. Testing & Launch Verification

**Automated (CI on every push):** `astro check` (types) + `npm run build` (includes Zod validation) → deploy.

**Manual launch checklist (documented, run before public announcement):**

1. `npm run build:launch` passes — zero placeholders/drafts remain.
2. `docs/content-todo.md` fully checked off (real phones, WhatsApp, address, hours, licenses, crisis lines confirmed).
3. Lighthouse mobile + desktop on the live pendarqom.ir (budgets §10).
4. RTL/visual QA at 360 / 390 / 768 / 1280 / 1440 px — no overflow, no clipped Persian diacritics, correct numeral rendering.
5. `tel:` and `wa.me` links tested from a real phone (iPhone + Android), incl. prefilled WhatsApp texts.
6. Keyboard pass: drawer, accordion, lightbox, focus visibility, skip link.
7. Screen-reader spot check (VoiceOver) on home + contact.
8. Structured data validated (Google Rich Results test, schema.org validator); OG preview tested in Telegram + WhatsApp.
9. Internal link check on built output (no 404s); `sitemap.xml` + `robots.txt` reachable; HTTPS enforced (http → https redirect works).
10. Persian copy QA: tone, no diagnostic/cure claims, crisis-line numbers correct.
11. Testimonials: consent confirmed; attribution anonymized.
12. eNAMAD / registrar compliance check done (see §12).

---

## 12. Trust, Ethics & Legal

- **Credentials:** شماره پروانه نمایش داده شود (سازمان نظام روانشناسی و مشاوره / بهزیستی) — footer + therapist profiles (from `site.ts` / frontmatter).
- **Copy ethics:** no diagnostic claims, no cure promises; informational tone; «مشاوره جایگزین درمان پزشکی نیست»-style note on articles where relevant.
- **Crisis lines:** footer strip — صدای مشاور ۱۴۸۰، اورژانس اجتماعی ۱۲۳ (confirm exact numbers with clinic before launch).
- **Privacy:** no cookies/tracking (no banner needed); confidentiality messaging on contact page; no client photos without written consent; testimonials anonymized (initial + context only).
- **eNAMAD (اینماد):** site is informational, has no payments, and is hosted abroad — typically out of scope, but IRNIC rules change. Launch checklist item: confirm with registrar. If ever obtained, a badge slot exists in footer.
- **Hosting contingency note:** if GitHub ever becomes unreliable from Iranian networks, the identical static build deploys to any alternative static host; the domain is portable (change A/AAAA/CNAME accordingly).

---

## 13. Deployment & Operations

### 13.1 GitHub setup (one-time)

1. Create **public** repo `pendarqom.ir` under the owner's GitHub account.
2. Push this repo; GitHub Actions workflow (`.github/workflows/deploy.yml`) uses `withastro/action` + `actions/deploy-pages` to build and publish on every push to `main`.
3. Repo → Settings → Pages: **Source = GitHub Actions**; Custom domain = `pendarqom.ir`; enable **Enforce HTTPS** (GitHub auto-provisions a Let's Encrypt certificate — works for `.ir`).
4. `public/CNAME` contains `pendarqom.ir` (prevents domain reset on deploys).

### 13.2 DNS at the .ir registrar

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `<github-username>.github.io` |

- Canonical host: `https://pendarqom.ir` (apex). `www` redirects to apex via GitHub Pages.
- If the registrar panel is nameserver-only: delegate DNS to a free DNS provider (e.g., Cloudflare Free) and create the records there.
- Certificate issuance can take minutes to hours after DNS propagates; verify http→https and `www`→apex behavior on launch day.

### 13.3 Operations

- **Deploy:** push to `main` → auto build + deploy (~1 min). PRs/pushes to other branches do not deploy.
- **Local preview:** `npm run dev` (Astro dev server).
- **Rollback:** `git revert` the offending commit → push → previous state restored.
- **History:** GitHub Actions run history + Pages deployments provide an audit trail.
- **Domains/TLS renewals:** fully managed by GitHub.

---

## 14. Future Options (explicitly deferred, not v1)

Online booking integration (Iranian platforms), request forms (Formspree/Google Forms), analytics, newsletter, dark mode, English section, RSS, OG image auto-generation per article, Lighthouse CI in GitHub Actions, eNAMAD badge.

---

## 15. What the Clinic Must Provide Before Launch

1. Real phone number(s), WhatsApp number, (optional) email.
2. Social handles: Instagram, Telegram, Eitea, Bale — only those actively used.
3. Exact address + preferred map deep link (نشان/بلد/Google).
4. Working hours (per day), holidays policy.
5. License numbers (نظام روانشناسی / بهزیستی) for footer + each therapist.
6. Therapist real data: names, titles, licenses, specialties, approaches, education, photos.
7. Service list + descriptions (or approve the seeded drafts).
8. Workshop details for the real first workshops.
9. Testimonials with explicit consent (anonymized).
10. Clinic gallery photos (and shoot-guide given in §5.5).
11. Confirmation of crisis-line numbers.
12. Registrar/eNAMAD compliance confirmation.

At implementation start we also need: **GitHub username** (for the `www` CNAME and repo URL).
