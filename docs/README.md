# Athena Stock - Documentation Index

## Overview

This directory contains comprehensive documentation for the Athena Stock project - a value investing education platform built with Next.js 16, React 19, and TypeScript.

---

## Documentation Files

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
- Business Analysis template (10 required sections)
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

- POST /api/booking - Create booking with Google Meet
- GET /api/booking/confirm - Admin approval endpoint
- POST /api/booking/reschedule - Admin reschedule
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
- Google Calendar/Meet configuration
- Resend email setup
- Vercel deployment (GitHub integration & CLI)
- Custom domain configuration
- Post-deployment checklist
- Monitoring and troubleshooting

---

## Quick Start

1. **Architecture first**: Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. **Add content**: Follow [CONTENT-GUIDE.md](./CONTENT-GUIDE.md) to create articles
3. **Customize components**: Reference [COMPONENT-API.md](./COMPONENT-API.md) for component props
4. **Deploy**: Use [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

---

## Key Principles

- **No database** - All content is MDX files
- **Static-first** - Pre-rendered at build time
- **Type-safe** - Full TypeScript coverage
- **Calm design** - No aggressive CTAs or FOMO tactics

---

## Main README

See [../README.md](../README.md) for project overview and getting started guide.
