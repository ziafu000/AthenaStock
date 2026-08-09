# Component API Documentation

## Overview

> Component decisions for the redesign must follow [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md). Existing APIs below describe the current implementation unless marked as target.

This document provides detailed API documentation for all React components in the Athena Stock project.

---

## Target Redesign Component System

The redesign must provide reusable, typed, data-driven versions of: Header, Footer, Hero, SectionHeading, CTAGroup, PrincipleCard, FrameworkStep, CompanyCard, PsychologyTopicCard, InspirationCard, ArticleCard, QuoteBlock, DarkStatementSection, Breadcrumb, Search, Filter, Pagination or LoadMore, Disclaimer, and responsive navigation.

All target components must support mobile layouts, keyboard navigation, visible focus states, semantic markup, restrained motion, and reduced-motion preferences.

---

## Layout Components

### Header

**Location:** \src/components/layout/Header.tsx\

**Description:** Main site navigation header with responsive mobile menu and dark mode toggle.

**Features:**
- Responsive navigation menu
- Dark/light mode toggle
- Mobile hamburger menu
- Active route highlighting

**Target contract:** Use the Vietnamese navigation defined in the product direction and include the primary CTA “Trao đổi cùng Athena”. “About” belongs under Triết lý Athena and in the footer.

**Usage:**

\\\	sx
import { Header } from '@/components/layout/Header'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
\\\

---

### Footer

**Location:** \src/components/layout/Footer.tsx\

**Description:** Site footer with newsletter subscription and navigation links.

**Features:**
- Newsletter subscription form
- Quick links to main sections
- Social media links
- Copyright notice

**Usage:**

\\\	sx
import { Footer } from '@/components/layout/Footer'

<Footer />
\\\

---

### BookingModal

**Location:** \src/components/layout/BookingModal.tsx\

**Description:** Modal dialog for booking advisory sessions with Google Meet integration.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \isOpen\ | \oolean\ | Yes | Controls modal visibility |
| \onClose\ | \() => void\ | Yes | Callback when modal closes |

**Usage:**

\\\	sx
import { BookingModal } from '@/components/layout/BookingModal'

const [isOpen, setIsOpen] = useState(false)

<BookingModal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
\\\

---

## Article Components

### ArticleLayout

**Location:** \src/components/article/ArticleLayout.tsx\

**Description:** Standard layout wrapper for article pages with reading progress and controls.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \post\ | \Post\ | Yes | Post object with metadata and content |
| \children\ | \ReactNode\ | Yes | Article content (MDX) |

**Usage:**

\\\	sx
import { ArticleLayout } from '@/components/article/ArticleLayout'

<ArticleLayout post={post}>
  <MDXRemote source={post.content} />
</ArticleLayout>
\\\

**Features:**
- Reading progress indicator
- Reading controls (font size, width)
- Related posts sidebar
- Share buttons
- Table of contents (auto-generated from headings)

---

### BusinessAnalysisLayout

**Location:** \src/components/article/BusinessAnalysisLayout.tsx\

**Description:** Specialized layout for company research using the canonical 12-section structure.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \post\ | \Post\ | Yes | Post object with business metadata |
| \children\ | \ReactNode\ | Yes | Business analysis content |

**Usage:**

\\\	sx
import { BusinessAnalysisLayout } from '@/components/article/BusinessAnalysisLayout'

<BusinessAnalysisLayout post={post}>
  <MDXRemote source={post.content} />
</BusinessAnalysisLayout>
\\\

**Additional Features:**
- Stock ticker badges (from frontmatter)
- Risk level indicator
- Citation links
- Market/sector tags
- Structured 12-section navigation
- Visible last-researched date and disclaimer
- Clear separation between facts, assumptions, and judgment

---

### ReadingProgress

**Location:** \src/components/article/ReadingProgress.tsx\

**Description:** Thin progress bar at top of page showing reading progress.

**Usage:**

\\\	sx
import { ReadingProgress } from '@/components/article/ReadingProgress'

<ReadingProgress />
\\\

**Behavior:**
- Automatically tracks scroll position
- Shows percentage of content read
- Smooth animation
- Fixed to top of viewport

---

### RelatedPosts

**Location:** \src/components/article/RelatedPosts.tsx\

**Description:** Display related content recommendations based on tags and type.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \currentPost\ | \Post\ | Yes | Current post to find related content for |
| \limit\ | \
umber\ | No | Max number of related posts (default: 3) |

**Usage:**

\\\	sx
import { RelatedPosts } from '@/components/article/RelatedPosts'

<RelatedPosts currentPost={post} limit={4} />
\\\

---

## Reading Experience Components

### ReadingContext

**Location:** \src/components/reading/ReadingContext.tsx\

**Description:** React Context provider for global reading preferences.

**State:**

\\\	ypescript
interface ReadingState {
  fontSize: 'small' | 'medium' | 'large'
  lineWidth: 'normal' | 'wide'
  focusMode: boolean
}
\\\

**Usage:**

\\\	sx
import { ReadingProvider, useReading } from '@/components/reading/ReadingContext'

// Wrap your app
<ReadingProvider>
  {children}
</ReadingProvider>

// Use in components
const { fontSize, setFontSize } = useReading()
\\\

**Methods:**

| Method | Type | Description |
|--------|------|-------------|
| \setFontSize\ | \(size: 'small' \| 'medium' \| 'large') => void\ | Update font size |
| \setLineWidth\ | \(width: 'normal' \| 'wide') => void\ | Update line width |
| \	oggleFocusMode\ | \() => void\ | Toggle focus mode |

**Persistence:** All preferences saved to \localStorage\

---

### ReadingControls

**Location:** \src/components/reading/ReadingControls.tsx\

**Description:** Floating control panel for adjusting reading preferences.

**Usage:**

\\\	sx
import { ReadingControls } from '@/components/reading/ReadingControls'

<ReadingControls />
\\\

**Controls:**
- **A↓** - Decrease font size
- **A↑** - Increase font size
- **Width toggle** - Normal/Wide line width
- **Focus mode** - Toggle distraction-free mode

---

## UI Components

### ModeToggle

**Location:** \src/components/ui/ModeToggle.tsx\

**Description:** Dark/light mode toggle button using next-themes.

**Usage:**

\\\	sx
import { ModeToggle } from '@/components/ui/ModeToggle'

<ModeToggle />
\\\

**Features:**
- Sun/Moon icon toggle
- Smooth theme transition
- Persisted to localStorage
- System preference detection

---

### ContentCarousel

**Location:** \src/components/ui/ContentCarousel.tsx\

**Description:** Animated carousel for showcasing featured content on homepage.

**Status:** Legacy presentation component. It is not the default pattern for the redesigned homepage or hero; use only when the content genuinely benefits from horizontal browsing.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \items\ | \CarouselItem[]\ | No | Custom carousel items (uses defaults if not provided) |

**Usage:**

\\\	sx
import { ContentCarousel } from '@/components/ui/ContentCarousel'

<ContentCarousel />
\\\

**Note:** Dynamically imported with loading state for performance.

---

### ScrollReveal

**Location:** \src/components/ui/ScrollReveal.tsx\

**Description:** Wrapper component for scroll-triggered animations.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| \children\ | \ReactNode\ | Yes | - | Content to animate |
| \delay\ | \
umber\ | No | 0 | Animation delay (ms) |
| \duration\ | \
umber\ | No | 600 | Animation duration (ms) |
| \direction\ | \'up' \| 'down' \| 'left' \| 'right'\ | No | 'up' | Animation direction |

**Usage:**

\\\	sx
import { ScrollReveal } from '@/components/ui/ScrollReveal'

<ScrollReveal delay={200} direction="left">
  <div>Content to animate</div>
</ScrollReveal>
\\\

---

## MDX Components

### Callout

**Location:** \src/components/callout-box.tsx\

**Description:** Highlighted callout boxes for important information, warnings, and risks.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| \	ype\ | \'default' \| 'info' \| 'warning' \| 'danger'\ | No | 'default' | Callout style type |
| \	itle\ | \string\ | No | - | Callout heading |
| \children\ | \ReactNode\ | Yes | - | Callout content |

**Usage in MDX:**

\\\mdx
<Callout type="info" title="Key Insight">
  This is important information that readers should notice.
</Callout>

<Callout type="danger" title="Major Risk">
  This investment carries significant downside risk.
</Callout>
\\\

**Visual Styles:**

- **default** - Gray border, neutral tone
- **info** - Blue border, informational
- **warning** - Yellow/orange border, caution
- **danger** - Red border, critical warnings

---

## Utility Components

### PostCard

**Location:** \src/components/post-card.tsx\

**Description:** Card component for displaying post previews in listings.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \post\ | \Post\ | Yes | Post object with metadata |

**Usage:**

\\\	sx
import { PostCard } from '@/components/post-card'

<PostCard post={post} />
\\\

**Features:**
- Thumbnail image
- Title and description
- Reading time
- Tags
- Publication date
- Type badge (article/business/psychology/framework)

---

## TypeScript Types

### Post Type

\\\	ypescript
interface Post {
  metadata: Frontmatter
  content: string
  slug: string
}
\\\

### Frontmatter Type

\\\	ypescript
interface Frontmatter {
  title: string
  description: string
  date: string
  updatedAt?: string
  type: ContentType
  tags: string[]
  readingTime: string
  series?: string
  
  // Business-specific fields
  tickers?: string[]
  market?: 'HOSE' | 'HNX' | 'UPCOM'
  riskLevel?: 'low' | 'medium' | 'high'
  citations?: Citation[]
}
\\\

### ContentType

\\\	ypescript
type ContentType = 'article' | 'business' | 'psychology' | 'framework' | 'library'
\\\

---

## Further Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Content Creation Guide](./CONTENT-GUIDE.md)
- [API Routes Documentation](./API-ROUTES.md)
- [Features Implementation](./FEATURES.md)
