# Athena Stock - Documentation Index

## Overview

This directory documents AthenaStock, an **Investment Thinking House** that helps long-term investors think like business owners. The product is built with Next.js 16, React 19, and TypeScript.

---

## Documentation Files

### [IMPLEMENTATION-MAP.md](./IMPLEMENTATION-MAP.md)
**Read before implementation - audited delivery plan**

- File-by-file implementation scope
- Workstream ownership and dependency order
- Security, migration, QA, and release gates
- Approved booking-completion roadmap: availability, admin, self-service, outbox, abuse controls, and meeting adapter
- Parallel-agent boundaries and rollback plan

### 🧭 [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md)
**Read first — canonical product direction and frontend-preservation decision**

- North Star, audience, positioning, and voice
- Company-research and content standards
- Backend, security, and implementation guardrails
- Keeps the current committed frontend as the UI/UX source of truth

### 📐 [ARCHITECTURE.md](./ARCHITECTURE.md)
**248 lines** - Core architecture and tech stack

- Project structure and file organization
- Tech stack details (Next.js, MDX, Tailwind, APIs)
- Content system overview
- Routing architecture
- Component architecture
- Styling system
- Build and deployment overview

### ✍️ [CONTENT-GUIDE.md](./CONTENT-GUIDE.md)
**359 lines** - Content creation and writing guide

- Content types (article, business, psychology, framework)
- Frontmatter schemas for each type
- Business Analysis template (12 required sections)
- MDX components usage (Callout, Image, etc.)
- Writing guidelines and tone rules
- Step-by-step content creation workflow
- QA checklist before publishing

### 🧩 [COMPONENT-API.md](./COMPONENT-API.md)
**311 lines** - React component API documentation

- Layout components (Header, Footer, BookingModal)
- Article components (ArticleLayout, BusinessAnalysisLayout)
- Reading experience components (ReadingContext, ReadingControls)
- UI components (ModeToggle, ContentCarousel, ScrollReveal)
- MDX components (Callout)
- TypeScript type definitions
- Props and usage examples

### 🔌 [API-ROUTES.md](./API-ROUTES.md)
**265 lines** - API endpoint documentation

- POST /api/booking - Persist a booking and notify admin
- GET/POST /api/booking/confirm - Preview and approve a booking
- GET/POST /api/booking/reschedule - Load and submit reschedule suggestions
- Availability, customer respond/cancel, admin and cron-worker contracts
- POST /api/subscribe - Email subscriptions
- GET /api/search - Content search
- Environment variables required
- Error handling and security

### ⚡ [FEATURES.md](./FEATURES.md)
**303 lines** - Feature implementation details

- Focus Mode implementation
- Font size and line width controls
- Reading progress bar
- Dark mode (next-themes)
- Content search algorithm
- Booking system flow
- Email subscriptions
- Related posts algorithm
- Performance optimizations
- Analytics and monitoring
- SEO features
- Accessibility

### 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md)
**153 lines** - Deployment and production setup

- Environment variables setup
- PostgreSQL migration and connection setup
- Resend email setup
- Vercel deployment (GitHub integration & CLI)
- Custom domain configuration
- Post-deployment checklist
- Monitoring and troubleshooting

---

## Quick Start

1. **Product direction first**: Read [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md) before making product or design decisions
2. **Understand the system**: Use [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Add content**: Follow [CONTENT-GUIDE.md](./CONTENT-GUIDE.md)
4. **Customize components**: Reference [COMPONENT-API.md](./COMPONENT-API.md)
5. **Deploy**: Use [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Key Principles

- **File-based content** - Published content remains in MDX; PostgreSQL is scoped to transactional booking data
- **Static-first** - Pre-rendered at build time
- **Type-safe** - Full TypeScript coverage
- **Business-owner thinking** - Teach investors how to understand and own businesses
- **Calm design** - No aggressive CTAs or FOMO tactics

---

## Main README

See [../README.md](../README.md) for project overview and getting started guide.
