# World Cup ATL Guide

Atlanta's independent local guide for **World Cup 2026** — matches, Fan Fest, watch parties, restaurants, bars, nightlife, neighborhoods, transportation, and local business listings. Powered by **CodeByCed**.

> This is an independent local guide and is not affiliated with FIFA, the FIFA World Cup, or official host organizations.

---

## What this platform is

A mobile-first Next.js website that serves as:

- A **local World Cup guide** for visitors and fans
- An **event directory** with filters (watch parties, food, family, nightlife...)
- A **business directory** for restaurants, bars, lounges, food trucks, hotels, Airbnb hosts, shops, and experiences
- A **neighborhood guide** with transit tips
- A **lead-capture system** for CodeByCed business services (listings, QR pages, AI concierge, Make.com automations)
- A **foundation** for an AI concierge ("Ask ATL Matchday") and future monetization features

Phase 1 is intentionally lean: static mock data, clean components, strong metadata, deploy-ready.

---

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- React 18
- No database yet — all data lives in `lib/data/*.ts`

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Other scripts

```bash
npm run build      # production build
npm run start      # run the production build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```

---

## Folder structure

```
app/
  layout.tsx                  Root layout (Navbar + Footer + metadata)
  page.tsx                    Home
  matches/page.tsx
  fan-fest/page.tsx
  events/page.tsx             (client — filters)
  events/layout.tsx           (metadata for the events route)
  businesses/page.tsx         (client — filters)
  businesses/layout.tsx       (metadata)
  neighborhoods/page.tsx
  transportation/page.tsx
  submit/page.tsx
  business-services/page.tsx
  api/submit/route.ts         POST handler for the submission form
  globals.css

components/
  Navbar, Footer, Hero, SectionHeader,
  MatchCard, EventCard, BusinessCard, NeighborhoodCard,
  CTASection, FilterBar, SubmitForm, PricingCard, AIConciergePreview

lib/
  types.ts                    Match, EventItem, Business, Neighborhood,
                              ServicePackage, SubmissionFormData
  data/
    matches.ts
    events.ts
    businesses.ts
    neighborhoods.ts
    services.ts
```

---

## How to update mock data

All content for Phase 1 lives in `lib/data/`. Edit the array in the matching file:

| Section           | File                          |
| ----------------- | ----------------------------- |
| Match schedule    | `lib/data/matches.ts`         |
| Events            | `lib/data/events.ts`          |
| Businesses        | `lib/data/businesses.ts`      |
| Neighborhoods     | `lib/data/neighborhoods.ts`   |
| Service packages  | `lib/data/services.ts`        |

Types live in `lib/types.ts`. Every entity includes `id`, `slug`, `createdAt`, `updatedAt`, and where relevant, `isFeatured`, `tags`, and `ctaUrl`. This makes migrating to a database painless later.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Accept defaults — no environment variables are required to deploy Phase 1.
4. Add a custom domain in the Vercel dashboard.

---

## Environment variables

Copy `.env.example` to `.env.local` to configure optional integrations:

```bash
cp .env.example .env.local
```

| Variable              | What it does                                          |
| --------------------- | ----------------------------------------------------- |
| `SUBMIT_WEBHOOK_URL`  | Make.com / n8n / Zapier webhook for form submissions  |
| `STRIPE_SECRET_KEY`   | Future — paid listings, featured upgrades             |
| `ANTHROPIC_API_KEY`   | Future — wire up the AI concierge (Claude API)        |
| `MONGODB_URI`         | Future — swap mock data for MongoDB                   |
| `SUPABASE_URL` / `..` | Future — Supabase alternative                         |
| `GOOGLE_MAPS_API_KEY` | Future — maps and distance                            |

---

## Where to connect integrations later

### Database (MongoDB / Supabase / Airtable)

Replace each file under `lib/data/*.ts` with a function that fetches from your DB and returns the same typed array. Component contracts don't change. Example pattern:

```ts
// lib/data/events.ts
import type { EventItem } from "@/lib/types";
export async function getEvents(): Promise<EventItem[]> { /* fetch from DB */ }
```

Then update the pages that currently import `events` to `await getEvents()`.

### Make.com / n8n / Zapier

The submission form posts to `/api/submit` (see `app/api/submit/route.ts`). If `SUBMIT_WEBHOOK_URL` is set, the route forwards the payload to your webhook. Build a scenario in Make.com that:

1. Receives the JSON payload
2. Writes to Google Sheets / Airtable / Notion
3. Sends you a Slack or email notification
4. Optionally creates a draft listing

### Stripe (paid listings, featured upgrades, QR packages)

Add an `/app/api/checkout/route.ts` that creates a Stripe Checkout Session. Each `ServicePackage` in `lib/data/services.ts` can map to a Stripe Price ID. Update the "Get Featured" CTA to POST to `/api/checkout` instead of linking to `/submit`.

### AI Concierge (Claude API)

`components/AIConciergePreview.tsx` is a UI-only preview today. To ship it:

1. Add `ANTHROPIC_API_KEY` to `.env.local`
2. Install `@anthropic-ai/sdk`
3. Create `app/api/concierge/route.ts` that takes a user question and returns a streamed answer from Claude — ground it in your mock data (or DB) so answers cite real listings
4. Enable the input/button in `AIConciergePreview.tsx` and wire a fetch to `/api/concierge`

Use `claude-sonnet-4-6` as a solid default. Add prompt caching for the system prompt + listings context to keep costs down.

### Email capture / newsletter

Home and footer have placeholder newsletter forms. Point them at Mailchimp, ConvertKit, or Buttondown by creating `/app/api/subscribe/route.ts`.

### Google Maps

Add a `GoogleMap` component using `@vis.gl/react-google-maps` or similar when you're ready to show pins on business and neighborhood pages.

---

## Phase 2+ roadmap

**Phase 2 — Monetization foundation**
- Stripe Checkout for Basic / Featured / QR / Concierge packages
- Business owner dashboard (sign in, edit your listing)
- Admin dashboard (approve submissions)
- Newsletter capture wired up
- Swap mock data for Supabase or Mongo

**Phase 3 — AI + automation**
- Ship the "Ask ATL Matchday" concierge on top of Claude
- Per-business embeddable AI FAQ widgets (paid)
- Make.com-powered event scraping / intake pipelines
- SMS follow-up for leads

**Phase 4 — Content + SEO**
- `/matches/[slug]`, `/events/[slug]`, `/businesses/[slug]`, `/neighborhoods/[slug]` detail pages
- `/blog` with matchday guides, neighborhood deep dives, SEO content
- Team-specific and country-specific food/event pages
- Multilingual (ES, PT, FR) for visiting fans

**Phase 5 — Scale**
- PWA / mobile app wrapper
- Affiliate links for hotels and experiences
- Downloadable paid guide
- Analytics dashboard for featured partners

---

## Brand & legal notes

- No FIFA logos, marks, or official branding.
- Copy uses generic language like "World Cup 2026 in Atlanta" and "the tournament."
- The footer carries a visible independent-guide disclaimer.
- Keep this guide positioned as an independent Atlanta-first resource.

---

## Credits

Built by CodeByCed. Feedback and business inquiries: submit via `/submit`.
