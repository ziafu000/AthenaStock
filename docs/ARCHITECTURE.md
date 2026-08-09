# Architecture Documentation

## Overview

**AthenaStock** is an Investment Thinking House built with Next.js 16 App Router, React 19, and TypeScript 5.

> Product, information architecture, and visual decisions must follow [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md). This file documents how that direction is implemented technically.

### Design Philosophy

- **No database**: Content stored as MDX files
- **Static-first**: Pre-render at build time
- **Typography-first**: Reading experience is priority
- **Calm design**: No popups, countdowns, or aggressive CTAs
- **Type-safe**: Full TypeScript coverage

---

## Target Product Architecture

- Preserve the current Next.js, MDX, search, booking, SEO, and static-content foundations.
- Migrate public routes to the Vietnamese information architecture defined in the product direction.
- Treat current English routes as legacy migration surfaces; add redirects or compatibility mappings instead of letting them define the new navigation.
- Build shared sections and cards from typed data so content order and presentation remain consistent across pages.
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
- **googleapis 173.0.0** - Google Calendar/Meet integration
- **resend 6.12.4** - Email service (transactional)
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

## Current Routing Architecture (Legacy During Migration)

The routes below describe the current implementation. The target public routes and navigation are defined in [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md).

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
- \POST /api/booking\ - Create booking with Google Meet
- \GET /api/booking/confirm\ - Admin approval endpoint
- \POST /api/booking/reschedule\ - Admin reschedule
- \POST /api/subscribe\ - Email subscription
- \GET /api/search\ - Content search

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
- **No runtime database**: All content is static

---

## Styling System

### Target Design Tokens

- Deep navy: authority, focus, and primary surfaces
- Ivory: warm reading background
- Muted gold or champagne: restrained emphasis
- Soft sage: reflection and calm
- Red: warnings and errors only
- Serif for editorial authority; sans-serif for navigation, controls, and data

### Current Tailwind Configuration (Legacy Tokens)

The wine/crimson configuration below documents the current code only; it must not constrain the redesign.

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
ADMIN_EMAIL=ngocvcsc@gmail.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
RESEND_API_KEY=re_xxxxx
BOOKING_SECRET=secret-token
SENDER_EMAIL=Athena Stock <contact@athenastock.com>
NEXT_PUBLIC_APP_URL=https://athenastock.com
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
