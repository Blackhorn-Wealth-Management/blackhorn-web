# CLAUDE.md — Blackhorn Wealth Management Website Project Context

> **Read this file first.** It contains the full project history, architecture,
> current state, and pending tasks.
>
> **Last updated:** May 2026 — post Codex audit cleanup, pre-handoff to Blackhorn IT.

---

## PROJECT OVERVIEW

**Client:** Blackhorn Wealth Management Limited (晉羚財富管理)
**Website:** https://blackhorn-web.vercel.app (staging)
**Production domain:** blackhorngrp.com (not yet cut over)
**Repo:** GitHub (pushed from local, deployed to Vercel)
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Sanity CMS
**Design:** Dark luxury theme (dark-900 backgrounds, gold accents)
**Bilingual:** English + Traditional Chinese (next-intl infrastructure ready, Chinese content pending)

**Client contacts:**
- Mary Chiu — Co-founder, Managing Director
- Yugi Lee — Co-founder
- Rachel Ip — Marketing Coordinator (primary point of contact for website)

**Developer:** Ulrich (you're working for him)

---

## COMPANY DETAILS

- SFC Licensed: Type 4 (Advising on Securities) & Type 9 (Asset Management)
- License number: BNM924
- Phone: (852) 2709 1388
- Email: info@blackhorngrp.com
- Address: Hong Kong (exact address in site settings)
- 11 bank partners (UBS, BNP, Credit Suisse, etc.)
- ~40 staff, serves UHNW families
- Structured products are ~40% of volume

---

## ARCHITECTURE

### Directory Structure (after route group refactoring)
```
src/app/
  layout.tsx              ← root: <html>, <body>, metadata, globals.css
  (site)/
    [locale]/
      layout.tsx          ← font vars, NextIntlClientProvider, Navbar, Footer
      page.tsx            ← homepage
      about/
      services/
      press/
      awards/
      events/
      contact/
      important-notice/
  (studio)/
    layout.tsx            ← minimal full-height div wrapper
    studio/
      [[...tool]]/
        page.tsx          ← NextStudio component
  api/
```

### Key Config Files
- `sanity.config.ts` — Sanity Studio config (needs `basePath: '/studio'`)
- `src/lib/sanity/config.ts` — project ID, dataset, API version
- `src/lib/sanity/client.ts` — read client + write client
- `src/lib/sanity/queries.ts` — all GROQ queries
- `next.config.js` — Next.js config
- `tailwind.config.ts` — custom colors, fonts

### Design System
**Fonts:**
- Crimson Pro — serif, used for headings
- Inter — sans-serif, used for body (stand-in for Neue Montreal until they purchase it)
- Aptos — fallback

**Colors (Tailwind custom):**
- `dark-900` — primary background (#0a0a0a or similar near-black)
- `dark-800` — slightly lighter sections
- `dark-700` — card backgrounds, alternating sections
- `dark-600` — borders, subtle dividers
- `gold-400` — primary accent (buttons, highlights, hover states)
- `gold-500` — darker gold for text
- White text throughout on dark backgrounds

**Design references Rachel likes:**
- Charles Monat (monat.com) — minimal, big fonts, eye-catching photos, simple page structure
- New CIES — formal look with some white/light sections
- UBS HK Contact page — qualifying questions on contact form

---

## SANITY CMS

### Status
- ✅ Sanity project created (Ulrich's personal email)
- ✅ Schemas deployed (7 content types)
- ✅ Studio accessible at /studio (route group fix applied, commit 37e0bf2)
- ⚠️ `basePath: '/studio'` may still need adding to sanity.config.ts
- ⚠️ Migration script NOT yet run — Studio is empty, all content still hardcoded
- ⚠️ Rachel needs to create her own Sanity account to be invited as Editor

### Sanity Schemas
1. **teamMember** — name, slug, role, category (management/advisory), photo, bio, order, isInvestmentCommittee
2. **service** — title, slug, shortDescription, icon, content, features, order
3. **pressArticle** — title, slug, publication, author, publishDate, summary, externalUrl, heroImage, thumbnailImage, language
4. **award** — title, organization, year, category, image, description
5. **event** — title, slug, date, location, description, heroImage, gallery, speakers, ctaText, ctaEmail
6. **siteSettings** (singleton) — companyName, phone, email, all contact info, heroHeading, heroSubtext, missionStatement, trustBarStats, disclaimerText, fraudNoticeText
7. **legalPage** — title, slug, content, lastUpdated

### ENV Variables (in Vercel + .env.local)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_TOKEN`

---

## COMPLETED WORK (Commits History)

### Phase 1 — Scaffolding & Deployment
- Next.js 14 project scaffolded with TypeScript + Tailwind
- Dark luxury theme implemented
- Deployed to Vercel (blackhorn-web.vercel.app)
- All pages built: Homepage, About, Services (6 individual), Press, Awards, Events, Contact, Legal pages
- 53 pages total, 0 build errors

### Phase 2 — Content Population
- All team member bios populated (Mary Yuen, Yugi Harada, Alan Lee, Wilson Hui, Nejteh Yaghoubian, Peter Tsang, Andrew Lo)
- 6 services with full descriptions and features
- 7 press articles with summaries and external links
- 9 awards
- 2 events (3rd Anniversary Dinner, Entrepreneur Night)
- Legal pages: Terms of Service, Complaint Handling Policy, Important Notice
- Trust bar stats on homepage (AUM, Years, Team, Bank Partners)
- SFC license badge

### Phase 2 — Design Refinements (Rachel Feedback Round 1)
- **Typography:** Crimson Pro (serif headings) + Inter (sans body) + Aptos (fallback)
- **Colors expanded:** dark-700, dark-800, dark-600 variants for section alternation
- **Fraud Notice Modal:** Dismissable popup on first visit (localStorage), linked from footer
- **Important Notice page:** Static page at /important-notice with full fraud warning text (31 May 2024)
- **Alternating section backgrounds** across pages

### Phase 2 — Hero Images
- Victoria Peak golden sunset (from Rachel's original Wix site)
- Victoria Harbour dusk with Star Ferry
- Dark gradient overlays applied

### Phase 2 — Logo Transparency Fix
- Converted JPG logos (with black backgrounds) to transparent PNGs
- Created three variants:
  - `blackhorn-logo-dark-en-transparent.png` (white, English only — navbar/footer)
  - `blackhorn-logo-dark-transparent.png` (white, with Chinese text)
  - `blackhorn-logo-light-transparent.png` (black, for light backgrounds)

### Phase 2 — Sanity CMS Integration
- All schemas created and deployed
- Studio route set up with separate layout (route groups)
- GROQ queries written for all content types
- Components connected with fallback pattern (site works with empty CMS)
- Revalidation endpoint at /api/revalidate
- Studio excluded from next-intl middleware matcher

### Phase 2 — Studio Layout Fix (Commit 37e0bf2)
- Fixed blank /studio page (React hydration error from double <html> tags)
- Separated site and studio into route groups: (site) and (studio)
- Root layout provides <html>/<body>, route group layouts handle their own concerns

---

## CURRENT STATUS (May 2026)

### ✅ Completed
- Full bilingual site live on staging (blackhorn-web.vercel.app)
- Sanity CMS connected with all content types, bilingual fields, ISR revalidation
- Investor gate (disclaimer bottom sheet) — 1-hour TTL, bilingual
- All 6 service pages with CMS-driven content
- About sub-pages (leadership, advisors, vision, expertise, philosophy, partnerships, location)
- Insights hub (news, press, events)
- Contact form with Resend email delivery
- Awards, Careers pages
- Sitemap (en + zh-hant, static + dynamic Sanity routes)
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Codex audit completed May 2026 — all High + Medium issues resolved
- Dead code cleanup — 31 unused files removed, 150MB+ of junk purged from repo

### ⏳ Pending / Not Started
- **DNS cutover** — blackhorngrp.com not yet pointed to Vercel
- **Chinese content** — i18n infrastructure ready, CMS `_zh` fields exist, content not entered
- **Privacy Policy** — needs legal counsel (PDPO-compliant)
- **Neue Montreal font** — currently using Inter as stand-in (~$50 licence from Pangram Pangram)
- **Additional team members** — Andy Yuen (COO), Wong Po Sum, Danika Ma, Gregory Ng, Jody Leung
- **Remaining a11y items** — focus trap on investor gate, aria-pressed on contact form toggles, htmlFor on labels
- **Sanity visionTool** — disable in production sanity.config.ts (currently dev-only risk)

### 📬 Content still needed from Rachel
- Wilson Hui / Peter Tsang / Andrew Lo high-res headshots
- LinkedIn URL confirmation
- Privacy Policy (from legal)
- Chinese translations for all CMS content

---

## FUTURE FEATURES DISCUSSED

### Event Registration System (invitation-only)
Rachel requested Eventbrite-like features but firm is SFC-regulated — can't have public registration. Solution: invitation-only system where Rachel uploads guest list → unique invite links generated → clients RSVP via private link → QR codes for check-in. No public registration page.

### AI-Powered Internal Tools (separate project)
Discussed building local AI tools for the firm using Ollama (on-premise, no data leaves office):
- Client meeting brief generator
- Post-meeting notes structuring
- Bank statement auto-rename/filing tool
- Research digest summarizer
- Bilingual content drafting
- RFP/DDQ response automation
- Compliance monitoring

---

## IMPORTANT NOTES

- The site is NOT live on blackhorngrp.com yet — still on Vercel staging
- All content is currently HARDCODED — migration script needs to run to populate Sanity
- The site works without Sanity data (fallback pattern) so it won't break if CMS is empty
- Rachel expects to be able to edit content via Sanity Studio — she needs onboarding
- The /studio route works but may show "Tool not found: studio" until basePath is added
- Images from Rachel came as SVG wrappers around embedded JPEGs — already extracted to proper formats
- next-intl is set up for i18n but Chinese content hasn't been written yet
