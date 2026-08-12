# Architecture Documentation

## Overview

**AthenaStock** is an Investment Thinking House built with Next.js 16 App Router, React 19, and TypeScript 5.

> Product and content decisions follow [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md). The current committed frontend is the approved source of truth for information architecture and visual behavior.

### Design Philosophy

- **File-based content**: Published content stays in MDX; only transactional booking data uses PostgreSQL
- **Static-first**: Pre-render at build time
- **Typography-first**: Reading experience is priority
- **Calm design**: No popups, countdowns, or aggressive CTAs
- **Type-safe**: Full TypeScript coverage

---

## Product Architecture Guardrails

- Preserve the current Next.js, MDX, search, booking, SEO, and static-content foundations.
- Preserve current public routes, navigation, shared components, and page composition.
- Strengthen typed data, content validation, APIs, tests, and operations without altering presentation.
- Keep business research and investment psychology as equal product pillars.

---

## Tech Stack

### Core Framework
- **Next.js 16.2.4** - App Router with Server Components
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Node.js 20+** - Runtime

### Content Processing
- **next-mdx-remote 6.0.0** - MDX rendering
- **gray-matter 4.0.3** - Frontmatter parsing
- **remark-gfm 4.0.1** - GitHub Flavored Markdown
- **rehype-pretty-code 0.14.1** - Code syntax highlighting
- **shiki 3.22.0** - Syntax highlighting engine

### Styling
- **Tailwind CSS 3.4.0** - Utility-first CSS
- **@tailwindcss/typography 0.5.19** - Typography plugin
- **next-themes 0.4.6** - Dark mode
- **tailwind-merge 3.4.0** - Class merging utility

### APIs & Services
- **postgres 3.4.9** - PostgreSQL booking persistence and idempotency
- **resend 6.12.4** - Transactional email delivery
- **@vercel/analytics 2.0.1** - Web analytics
- **@vercel/speed-insights 2.0.0** - Performance monitoring

### UI
- **lucide-react 0.563.0** - Icon library
- **clsx 2.1.1** - Conditional classnames
- **date-fns 4.1.0** - Date formatting

---

## Project Structure

\\\
mindful-investing/
├── content/                    # MDX content (file-based CMS)
│   ├── article/                # Investment philosophy
│   ├── business/               # Business analysis
│   ├── psychology/             # Behavioral finance
│   └── framework/              # Frameworks & checklists
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/           # Page routes
│   │   │   ├── articles/
│   │   │   ├── business/
│   │   │   ├── psychology/
│   │   │   └── frameworks/
│   │   │
│   │   ├── api/                # API routes
│   │   │   ├── booking/        # Booking system
│   │   │   ├── subscribe/      # Email subscriptions
│   │   │   └── search/         # Content search
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   │
│   ├── components/
│   │   ├── layout/             # Header, Footer, Modals
│   │   ├── article/            # Article layouts
│   │   ├── reading/            # Reading controls
│   │   └── ui/                 # Reusable UI components
│   │
│   └── lib/                    # Utils & types
│       ├── mdx.ts              # MDX processing
│       ├── content-types.ts    # TypeScript types
│       └── utils.ts            # Utilities
│
├── public/                     # Static assets
└── docs/                       # Documentation
\\\

---

## Content System

### Content Types

| Type | Directory | Route | Description |
|------|-----------|-------|-------------|
| \rticle\ | \content/article/\ | \/articles/[slug]\ | Investment philosophy |
| \usiness\ | \content/business/\ | \/business/[slug]\ | Business analysis |
| \psychology\ | \content/psychology/\ | \/psychology/[slug]\ | Behavioral finance |
| \ramework\ | \content/framework/\ | \/frameworks/[slug]\ | Frameworks/checklists |

### MDX Processing Pipeline

\\\
MDX File → gray-matter (parse frontmatter)
        → remark plugins (markdown transforms)
        → rehype plugins (HTML transforms)
        → next-mdx-remote (render to React)
        → Custom components (Callout, etc.)
\\\

### File Structure

Each content file follows this pattern:

\\\markdown
---
title: "Article Title"
description: "SEO description (max 155 chars)"
date: "2024-01-15"
type: "article"
tags: ["investing", "philosophy"]
readingTime: "5 min"
---

# Heading 1

Content here...
\\\

---

## Current Routing Architecture

The routes below are the approved current implementation. No route migration is planned.

### Static Routes
- \/\ - Homepage
- \/about\ - About page
- \/advisory\ - Advisory services
- \/library\ - Content library
- \/series\ - Learning paths

### Dynamic Routes
- \/articles/[slug]\ - Article detail pages
- \/business/[slug]\ - Business analysis pages
- \/psychology/[slug]\ - Psychology content pages
- \/frameworks/[slug]\ - Framework pages

### API Routes
- \POST /api/booking\ - Persist a booking and notify admin
- \GET/POST /api/booking/confirm\ - Preview/approve and send email with `.ics`
- `GET/POST /api/booking/reschedule` - Load/submit reschedule suggestions
- `POST /api/subscribe` và `GET/POST /api/subscribe/unsubscribe` - Persistent consent, deduplication và one-time unsubscribe
- `GET /api/search` - Bounded, cached và rate-limited content search

---

## Booking Workflow Architecture

Status: implemented; production activation requires migrations and environment configuration in [DEPLOYMENT.md](./DEPLOYMENT.md).

```text
Public modal / customer action / admin dashboard
                    |
          authenticated API contracts
                    |
       PostgreSQL transaction boundary
       | booking state | one-time action |
       | slot lock     | email outbox    |
                    |
     post-response/daily worker claims jobs
                    |
                  Resend
```

Architectural rules:

- PostgreSQL owns availability, booking state, idempotency, action consumption and delivery jobs.
- `pending` requests do not reserve a slot; `confirmed` and `reschedule_requested` keep the current slot unavailable.
- Availability is read-only UX assistance. Every state transition rechecks the slot atomically.
- Business state and email jobs are written in the same transaction. Resend is called by a retryable post-response worker, with a Vercel Hobby-compatible daily Cron as fallback, not on the critical request path.
- Admin access uses a one-time magic link and signed HttpOnly session; booking data is never exposed through a public Supabase policy.
- Customer reschedule/cancel links are expiring, single-purpose and one-time-use.
- Meeting URLs are generated through a provider adapter only when a booking becomes confirmed, then persisted for deterministic retries and `.ics` output.
- Cloudflare Turnstile and PostgreSQL-backed hashed rate counters protect public mutations without storing raw IP addresses.

Implemented routes:

- `GET /api/booking/availability` - public safe slot flags for one date.
- `GET/POST /api/booking/respond` - customer preview and atomic selection of an offered slot.
- `GET/POST /api/booking/cancel` - safe preview and explicit cancellation.
- `POST /api/admin/auth/request` and `GET/POST /api/admin/auth/verify` - single-admin passwordless session; GET only previews.
- `GET /api/admin/bookings` and `/admin/bookings` - protected operational listing.
- `GET/POST /api/internal/booking-email-worker` - secret-protected outbox worker; daily Cron fallback.

No public navigation, page layout or visual-system migration is part of this target.

---

## Component Architecture

### Layout Components

**Header** (\components/layout/Header.tsx\)
- Site navigation
- Dark mode toggle
- Mobile responsive menu

**Footer** (\components/layout/Footer.tsx\)
- Site links
- Newsletter subscription form
- Social links

### Article Layouts

**ArticleLayout** (\components/article/ArticleLayout.tsx\)
- Standard article wrapper
- Reading progress indicator
- Related posts sidebar

**BusinessAnalysisLayout** (\components/article/BusinessAnalysisLayout.tsx\)
- Canonical 12-section research layout
- Risk callouts
- Citation links
- Stock ticker badges

### Reading Experience

**ReadingContext** (\components/reading/ReadingContext.tsx\)
- Global reading state (font size, width, focus mode)
- LocalStorage persistence

**ReadingControls** (\components/reading/ReadingControls.tsx\)
- Font size controls (A↓/A↑)
- Line width toggle (Normal/Wide)
- Focus mode toggle

---

## State Management

### Client State
- **Reading preferences**: React Context + localStorage
- **Theme**: next-themes (dark/light mode)
- **Modal state**: Local component state

### Server State
- **Content**: File system reads at build time
- **Bookings**: PostgreSQL at runtime; isolated from the static MDX content system

---

## Styling System

### Current Tailwind Configuration

The existing wine/crimson configuration is the approved frontend baseline and should be preserved.

\\\	ypescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: '#9c1850',
        crimson: '#e61c5c',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
\\\

### Typography Plugin

The \@tailwindcss/typography\ plugin provides the \prose\ class for rich text content with sensible defaults for:
- Headings hierarchy
- Paragraph spacing
- Link styling
- List formatting
- Code blocks

---

## Performance Optimizations

### Build Time
- **Static Generation**: All pages pre-rendered
- **Incremental Static Regeneration**: Not used (content is static)
- **Image Optimization**: \
ext/image\ with automatic WebP conversion

### Runtime
- **Code Splitting**: Automatic by Next.js App Router
- **Dynamic Imports**: Used for heavy components (ContentCarousel)
- **Font Optimization**: \
ext/font\ with preloading

### Analytics
- **Vercel Analytics**: Real user monitoring
- **Speed Insights**: Core Web Vitals tracking

---

## Build & Deployment

### Environment Variables

\\\ash
# .env.local
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
ADMIN_EMAIL=ngocvcsc@gmail.com
RESEND_API_KEY=re_xxxxx
BOOKING_SECRET=a-random-secret-at-least-32-characters
SENDER_EMAIL=Athena Stock <contact@athenastock.com>
NEXT_PUBLIC_APP_URL=https://athenastock.com
BOOKING_ACTION_TTL_HOURS=72
BOOKING_MEETING_LOCATION=
\\\

### Build Commands

\\\ash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
\\\

### Vercel Deployment

1. Push to GitHub
2. Import project on Vercel
3. Configure environment variables
4. Deploy automatically on every push to \main\

**Build Settings:**
- Framework Preset: Next.js
- Build Command: \
pm run build\
- Output Directory: \.next\
- Node Version: 20.x

---

## Further Documentation

- [Content Creation Guide](./CONTENT-GUIDE.md) - How to write and publish content
- [Component API](./COMPONENT-API.md) - Component props and usage
- [API Routes](./API-ROUTES.md) - API endpoint documentation
- [Features](./FEATURES.md) - Feature implementation details
