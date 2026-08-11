# Features Documentation

## Overview

> [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md) defines the target product experience. This document inventories implementation features and must not override that direction.

This document details the implementation of key features in Athena Stock.

---

## Product Priorities

- Make business understanding, decision frameworks, and investment psychology the primary journeys.
- Preserve useful reading, search, booking, SEO, and subscription capabilities.
- Preserve the current frontend design and interaction model.
- Add visible research freshness, sources, disclaimers, and legal trust signals.
- Meet mobile, keyboard, contrast, reduced-motion, performance, and metadata requirements.

---

## Reading Experience Features

### Focus Mode

**Purpose:** Distraction-free reading environment

**Implementation:**
- Located in \ReadingContext.tsx\
- Toggles via floating button (eye icon)
- Hides header, footer, and unnecessary UI
- Persists to localStorage

**Code:**

\\\	ypescript
const { focusMode, toggleFocusMode } = useReading()

// In layout components
{!focusMode && <Header />}
\\\

**Keyboard Shortcut:** Not implemented (consider adding Ctrl+F for future)

---

### Font Size Control

**Purpose:** Adjust text size for comfortable reading

**Options:**
- Small (16px base)
- Medium (18px base) - Default
- Large (20px base)

**Implementation:**

\\\	ypescript
const { fontSize, setFontSize } = useReading()

// CSS classes applied dynamically
<article className={\
  \
  \
  \
\}>
\\\

**UI:** A↓ and A↑ buttons in ReadingControls

**Persistence:** Saved to localStorage as \eading-preferences\

---

### Line Width Control

**Purpose:** Optimal reading line length for readability

**Options:**
- Normal: max-w-3xl (48rem / ~768px)
- Wide: max-w-5xl (64rem / ~1024px)

**Why:** Optimal line length is 50-75 characters per line for readability

**Implementation:**

\\\	ypescript
const { lineWidth, setLineWidth } = useReading()

<div className={\
  \
\}>
\\\

---

### Reading Progress Bar

**Purpose:** Show reading progress visually

**Features:**
- Fixed to top of viewport
- Smooth animation
- Calculates scroll percentage
- Minimal, non-intrusive design

**Implementation:**

\\\	ypescript
// ReadingProgress.tsx
const [progress, setProgress] = useState(0)

useEffect(() => {
  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrolled = (window.scrollY / scrollHeight) * 100
    setProgress(scrolled)
  }
  window.addEventListener('scroll', updateProgress)
}, [])
\\\

**Styling:**
- Height: 3px
- Color: Primary brand color (#e61c5c)
- z-index: 50 (above content, below modals)

---

## Dark Mode

**Technology:** next-themes library

**Features:**
- System preference detection
- Manual toggle via sun/moon icon
- Smooth transitions
- Persists to localStorage
- No flash on page load

**Implementation:**

\\\	ypescript
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
\\\

**Toggle Component:**

\\\	ypescript
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
\\\

**Tailwind Config:**

\\\javascript
// tailwind.config.ts
darkMode: ['class']
\\\

---

## Content Search

**Location:** \/api/search\

**Features:**
- Full-text search across all content
- Searches title, description, tags, content
- Case-insensitive
- Results sorted by relevance

**Search Algorithm:**
1. Title match (highest priority)
2. Description match (medium priority)
3. Tag match (medium priority)
4. Content match (lowest priority)

**UI:** SearchBubble component (floating button)

---

## Booking System

**Components:**
1. BookingModal - User-facing form
2. PostgreSQL - Booking state, confirmed-slot uniqueness, request deduplication, and retry control
3. Resend - Admin and customer email notifications
4. ICS generator - Provider-independent calendar invitation/cancellation

**Flow:**

\\\
User submits form
    ↓
POST /api/booking
    ↓
Persist pending request; different customers may request the same slot
    ↓
Email admin with approve/reschedule buttons
    ↓
Admin clicks approve
    ↓
GET preview → POST /api/booking/confirm
    ↓
Atomically confirm one booking per slot
    ↓
Email customer with .ics attachment
\\\

**Security:**
- Signed HMAC action tokens with purpose and expiry
- State-changing actions use POST, never GET
- Input validation, HTML escaping, idempotency, and replay protection

---

## Email Subscriptions

**Provider:** Resend

**Features:**
- Welcome email with HTML template
- Admin notification on new subscriber
- No database (managed via Resend dashboard)

**Template Styling:**
- Serene, professional design
- Responsive HTML
- Existing AthenaStock brand colors preserved
- Clear CTAs

---

## Related Posts Algorithm

**Location:** \src/lib/related.ts\

**Scoring System:**

\\\	ypescript
// Same content type: +3 points
// Shared tag: +2 points per tag
// Same series: +5 points
// Recent (within 30 days): +1 point
\\\

**Logic:**
1. Calculate relevance score for each post
2. Sort by score (descending)
3. Return top N results (default: 3)
4. Exclude current post from results

---

## Performance Optimizations

### Static Generation

All pages pre-rendered at build time:

\\\	ypescript
// Dynamic routes with generateStaticParams
export async function generateStaticParams() {
  const posts = await getAllPosts('article')
  return posts.map(post => ({ slug: post.slug }))
}
\\\

### Image Optimization

\\\	ypescript
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Description"
  width={1200}
  height={600}
  priority // For above-fold images
/>
\\\

**Features:**
- Automatic WebP conversion
- Lazy loading (except priority images)
- Responsive srcset generation
- Blur placeholder (optional)

### Code Splitting

\\\	ypescript
// Dynamic imports for heavy components
const ContentCarousel = dynamic(
  () => import('@/components/ui/ContentCarousel'),
  { loading: () => <LoadingSpinner /> }
)
\\\

### Font Optimization

\\\	ypescript
// next/font automatically optimizes font loading
import { Outfit, Playfair_Display } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
\\\

---

## Analytics & Monitoring

### Vercel Analytics

**Features:**
- Page views
- Unique visitors
- Top pages
- Traffic sources
- Geographic distribution

**Implementation:**

\\\	ypescript
import { Analytics } from '@vercel/analytics/react'

<Analytics />
\\\

### Speed Insights

**Metrics Tracked:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

**Implementation:**

\\\	ypescript
import { SpeedInsights } from '@vercel/speed-insights/next'

<SpeedInsights />
\\\

---

## SEO Features

### Metadata Generation

\\\	ypescript
// Per-page metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    type: 'article',
    images: ['/images/og-image.jpg'],
  },
}
\\\

### Sitemap

Auto-generated at \/sitemap.xml\:

\\\	ypescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllContent()
  return posts.map(post => ({
    url: \\/\/\\,
    lastModified: post.metadata.updatedAt || post.metadata.date,
  }))
}
\\\

### Robots.txt

\\\	ypescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: \\/sitemap.xml\,
  }
}
\\\

---

## Accessibility

### Keyboard Navigation
- Tab order follows logical flow
- Focus indicators visible
- Skip-to-content link (consider adding)

### Screen Readers
- Semantic HTML (article, nav, main, footer)
- Alt text on all images
- ARIA labels where needed

### Color Contrast
- WCAG AA compliance target
- Dark mode maintains contrast ratios

---

## Further Documentation

- [Architecture](./ARCHITECTURE.md)
- [Component API](./COMPONENT-API.md)
- [Content Guide](./CONTENT-GUIDE.md)
- [API Routes](./API-ROUTES.md)
