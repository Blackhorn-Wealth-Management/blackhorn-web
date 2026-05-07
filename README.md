# Blackhorn Wealth Management — Website

**Live staging:** https://blackhorn-web.vercel.app  
**Production domain:** https://www.blackhorngrp.com *(DNS cutover pending)*  
**Sanity Studio (CMS):** https://blackhorn-web.vercel.app/studio

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| CMS | Sanity v3 |
| Email | Resend |
| Deployment | Vercel (auto-deploy on push to `main`) |
| i18n | next-intl — English + Traditional Chinese |

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/itsulla/blackhorn-web.git
cd blackhorn-web

# 2. Install dependencies
npm install

# 3. Create your local env file
cp .env.example .env.local
# Fill in the values — see Environment Variables section below

# 4. Start the dev server
npm run dev
```

- Site: http://localhost:3000  
- Sanity Studio: http://localhost:3000/studio

---

## Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | sanity.io/manage → Project → Settings → API |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (`production`) | Same place |
| `SANITY_API_TOKEN` | Read token for server-side fetches | Sanity → API → Tokens |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the revalidation webhook | Any strong random string |
| `RESEND_API_KEY` | Email delivery API key | resend.com → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Public URL for sitemaps + OG tags | `https://www.blackhorngrp.com` |

> All of these are already configured in the Vercel project dashboard. For local dev, copy them into `.env.local`.

---

## Sanity CMS

### Accessing the Studio
1. Go to https://blackhorn-web.vercel.app/studio
2. Log in with a Sanity account that has been invited to the project
3. To invite new editors: [sanity.io/manage](https://sanity.io/manage) → Project → Members → Invite

### Content Types

| Document type | What it controls |
|---|---|
| **Site Settings** | Investor gate text, hero images, company info, trust bar stats |
| **Team Member** | Leadership and advisory board profiles + bios |
| **Service** | Service page content, key features accordion, infographic, ecosystem partners |
| **Blog Post** | News/insights articles (bilingual) |
| **Press Article** | Media coverage entries |
| **Award** | Awards and recognition |
| **Event** | Events, dinners, conferences |
| **Career Posting** | Open job listings |
| **Legal Page** | Terms, disclaimer, complaint policy |

### Revalidation Webhook
When content is published in Sanity, it calls back to the site to update only the affected pages instantly.

**Setup in Sanity → Manage → API → Webhooks:**
```
URL:        https://blackhorn-web.vercel.app/api/revalidate
Method:     POST
Trigger:    Create, Update, Delete
Projection: {_type}
Header:     Authorization: Bearer <SANITY_REVALIDATE_SECRET>
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    Root layout — html/body/metadata
│   ├── sitemap.ts                    Auto-generated sitemap (en + zh-hant)
│   ├── robots.ts                     robots.txt
│   ├── (site)/[locale]/              All public pages
│   │   ├── layout.tsx                Locale layout — fonts, navbar, footer
│   │   ├── page.tsx                  Homepage
│   │   ├── about/                    About + sub-pages
│   │   ├── services/                 6 service pages
│   │   ├── insights/                 News, events, press
│   │   ├── awards/
│   │   ├── careers/
│   │   └── contact/
│   ├── (studio)/studio/              Sanity Studio
│   └── api/
│       ├── contact/route.ts          Contact form → Resend
│       └── revalidate/route.ts       Sanity webhook → ISR revalidation
├── components/
│   ├── layout/                       Navbar, Footer, LanguageSwitcher
│   ├── home/                         Homepage section components
│   ├── services/                     ServicePageLayout (shared)
│   ├── about/                        Team grids, modals
│   ├── awards/                       AwardRow
│   ├── blog/                         BlogCategoryFilter
│   ├── ui/                           Button, Accordion, FadeIn, Counter
│   ├── seo/                          JSON-LD structured data
│   └── InvestorGateBottomSheet.tsx   Investor disclaimer gate
├── lib/
│   ├── sanity/
│   │   ├── client.ts                 Sanity read/write clients
│   │   ├── fetch.ts                  All data fetch functions (with ISR tags)
│   │   └── queries.ts                GROQ queries
│   ├── constants.ts                  SITE_CONFIG — phone, email, address
│   ├── services.ts                   Service list — slugs, icons, hrefs
│   └── i18n-utils.ts                 localized() helper for _zh fields
├── messages/
│   ├── en.json                       English UI strings
│   └── zh-hant.json                  Traditional Chinese UI strings
└── sanity/schemas/                   CMS schema definitions
```

---

## Bilingual Support (i18n)

- **English** — default locale, no URL prefix (e.g. `/services`)
- **Traditional Chinese** — prefixed with `/zh-hant` (e.g. `/zh-hant/services`)
- UI strings live in `src/messages/en.json` and `src/messages/zh-hant.json`
- CMS content has paired fields with `_zh` suffix (e.g. `title` + `title_zh`)
- The language switcher in the navbar handles locale switching

---

## Deployment

Every push to `main` triggers an automatic Vercel deployment (~2 min).

**To cut over to blackhorngrp.com:**
1. Vercel → Project → Settings → Domains → Add `blackhorngrp.com` and `www.blackhorngrp.com`
2. Update DNS at your registrar to point to Vercel's servers
3. Vercel handles SSL certificates automatically

---

## Key npm Scripts

```bash
npm run dev     # Start local dev server
npm run build   # Production build (includes TypeScript + ESLint checks)
npm run lint    # Run ESLint only
```

---

## Security

| Feature | Detail |
|---|---|
| Investor gate | Visitors accept disclaimer before browsing (1-hour TTL via localStorage) |
| Contact form | Rate limited to 5 req/min per IP; all inputs HTML-escaped; payload capped at 20KB |
| Revalidation webhook | Requires `Authorization: Bearer` secret header |
| HTTP security headers | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |

---

## SFC Compliance

Blackhorn is SFC-licensed (Type 4 — Advising on Securities, Type 9 — Asset Management, licence **BNM924**). The site includes:
- Investor disclaimer gate shown to all visitors on every new session
- Important Notice page at `/important-notice` with anti-fraud warning
- SFC licence badge displayed in the footer

---

## Contacts

| Role | Name |
|---|---|
| Co-founder / MD | Mary Chiu |
| Co-founder | Yugi Lee |
| Marketing | Rachel Ip |
| Developer | Ulrich |
