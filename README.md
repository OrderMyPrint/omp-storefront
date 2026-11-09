# Order My Print — Storefront

Customer-facing website for **Order My Print** (custom printing, India, INR). Built from the approved Figma design
(`Order My Print — Platform Design`, gate G1). Requirements, architecture and decisions live in the docs repository
[`OrderMyPrint/website`](https://github.com/OrderMyPrint/website).

> **Status:** product prices come live from the API ([`OrderMyPrint/omp-api`](https://github.com/OrderMyPrint/omp-api),
> `POST /api/v1/pricing/preview`) when `NEXT_PUBLIC_API_URL` is set; otherwise, or if the API can't be reached, the
> configurator shows a browser estimate labelled as such. Prices are researched reference rates (D-08). Sign-in,
> checkout, quote, contact and tracking are not connected yet (their API endpoints are still to be built): those forms
> validate input and then show a "not open yet" notice with the phone number. Nothing else is sent anywhere.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- CSS Modules on design tokens from Figma (`src/styles/tokens.css`, `src/styles/typography.css`) — no CSS framework
- Self-hosted Inter and Montserrat variable fonts (SIL OFL, `src/fonts`)
- `lucide-react` icons · Vitest for unit tests · ESLint + Prettier

## Getting started

Requires Node 20.9 or newer (CI uses Node 22).

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL (the API, e.g. http://localhost:4000) and NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Script           | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Development server                                |
| `npm run build`  | Production build (catalogue pages are ISR, 60 s)  |
| `npm start`      | Serve the production build                        |
| `npm run check`  | Lint + type check + unit tests                    |
| `npm test`       | Unit tests (pricing engine, INR formatting)       |
| `npm run format` | Format with Prettier                              |

CI (`.github/workflows/ci.yml`) runs format check, lint, type check, tests, build and `npm audit --omit=dev` on every
push and pull request.

## Project structure

```
src/
  app/                    Routes (one folder per page, Figma screen ID in each file's comment)
  components/
    ui/                   Design-system primitives: Button, Field, Alert, Breadcrumbs, CheckList, …
    layout/               Header, Footer, PageIntro, ErrorState
    home/                 Homepage sections (SF-HOME-01)
    catalogue/            ProductCard, CategoryTile, ProductBrowser (filters + sort)
    configurator/         Product configurator, tier table, artwork upload, product tabs
    cart/ forms/ help/    Cart view, form components, FAQ browser
  config/site.ts          Brand, phone, hours, routes and navigation
  data/catalogue.ts       Catalogue types + built-in fallback (used when the API is unreachable, and by the homepage)
  data/help.ts            FAQ, artwork rules and policy drafts
  lib/                    catalogue (live catalogue from the API + slug redirects), rules (constraint hints),
                          pricing (estimate engine), cart (browser storage), format (₹), validation
  styles/                 Design tokens and text styles
```

## Pages

| Route                      | Figma screen   |
| -------------------------- | -------------- |
| `/`                        | SF-HOME-01     |
| `/products`                | SF-PLP-01      |
| `/category/[slug]`         | SF-CAT-01      |
| `/products/[slug]`         | SF-PDP-01 … 07 |
| `/search?q=`               | SF-SRCH-01     |
| `/cart`                    | SF-CART-01     |
| `/quote`                   | SF-QUO-01      |
| `/track`                   | SF-TRK-01      |
| `/sign-in`                 | SF-AUTH-01     |
| `/help`, `/help/contact`   | SF-HELP-01, 02 |
| `/help/artwork-guidelines` | SF-HELP-04     |
| `/policies/[slug]`         | SF-HELP-03     |
| 404 / error                | SF-ERR-01      |

## Rules for contributors

- **Use the tokens.** No hard-coded colours, spacing or radii in components; use `var(--omp-…)` and the `t-*` text
  classes.
- **No invented business data.** Prices, options and turnaround come from `docs/prd/product-catalogue-and-pricing.md`
  §5. An option without a researched price is marked `unavailable` ("Priced on quotation") rather than given a price.
  Legal policies stay marked as drafts until decision D-09 is closed.
- **The server decides the price.** `src/lib/pricing.ts` is a display estimate. When the API exists, its pricing
  engine is the single source of truth and checkout must use the server's figure.
- **Brand assets are supplied files.** Never recolour or redraw `public/images/logo-compact.png`.
- **No secrets in Git.** Only `.env.example` is committed.

## Not built yet (needs the Phase 3 API)

OTP sign-in and account pages, checkout and payment, order tracking results, quotation and contact submission,
artwork upload to storage with virus scanning, server-side pricing, coupons, and the cookie-consent banner (needed once
analytics is added).
