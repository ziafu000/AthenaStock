# AthenaStock Redesign - Implementation Map

Status: implementation-ready audit, before product code changes  
Canonical direction: [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md)

## 1. Baseline and release gates

Current baseline:

- Next.js 16.2.4, React 19.2.3, TypeScript strict, Tailwind CSS 3.4, local MDX content.
- Production build passes all 24 static pages when Google Fonts are reachable.
- Lint has 0 errors and 3 warnings; only one warning is in product code: unused Clock in src/components/layout/SearchBubble.tsx.
- No automated test framework is configured; test-mdx.ts is only a standalone content check.
- Existing app still expresses the legacy brand concept rather than the new Investment Thinking House direction.

Release gates:

| Gate | Must be true |
|---|---|
| P0 - security | Remove fallback booking secret; signed, expiring, single-purpose admin actions; no state-changing GET; validate and escape external input |
| P1 - product contract | New route contract, navigation, metadata, content schemas, design tokens, and migration aliases are agreed and implemented |
| P1 - experience | Homepage and all primary templates match the new narrative; responsive and keyboard behavior verified |
| P1 - quality | Build, lint, type check, route smoke tests, metadata, sitemap, robots, and broken-link checks pass |
| P2 - operations | Subscription persistence/consent, observability, rate limiting, image optimization, and dependency cleanup |

Do not cut over public CTAs to booking until the P0 gate passes.

## 2. Target route contract

| Target route | Current source / status | Implementation |
|---|---|---|
| / | src/app/page.tsx | Full narrative rebuild in the required ten-section order |
| /triet-ly | src/app/about/page.tsx | Migrate and rewrite; keep /about as a permanent redirect |
| /framework | src/app/frameworks/page.tsx | Rename index route; keep /frameworks redirect |
| /framework/[slug] | src/app/frameworks/[slug]/page.tsx | Move template and generate metadata; keep old-path redirect |
| /doanh-nghiep | src/app/business/page.tsx | Rename and reshape index; keep /business redirect |
| /doanh-nghiep/[slug] | src/app/business/[slug]/page.tsx | Enforce twelve-section research contract; keep old-path redirect |
| /tam-ly | src/app/psychology/page.tsx | Rename and reshape index; keep /psychology redirect |
| /tam-ly/[slug] | src/app/psychology/[slug]/page.tsx | Preserve detail capability under new route |
| /bai-viet | src/app/articles/page.tsx | Rename and reshape index; keep /articles redirect |
| /bai-viet/[slug] | src/app/articles/[slug]/page.tsx | Move detail template and metadata; keep old-path redirect |
| /dong-hanh | src/app/advisory/page.tsx | Rewrite conversion journey; keep /advisory redirect |
| /lien-he | missing | Add contact page and clear response expectations |
| /chinh-sach-bao-mat | missing | Add privacy policy before collecting leads |
| /dieu-khoan-su-dung | missing | Add terms page |
| /series | src/app/series/page.tsx | Decide whether to retain as a secondary editorial route; fix relative article links |
| /library | src/app/library/page.tsx | Remove dead child links or implement destinations before retaining |
| /disclaimer | src/app/disclaimer/page.tsx | Retain and update cross-links |

Route migration must use redirects rather than duplicating indexable pages. All internal links, canonical URLs, sitemap entries, breadcrumbs, and related-content URLs move together.

## 3. Workstreams and file map

### WS0 - Contracts, migration safety, and shared foundations

Owner: lead integrator. This workstream lands first because every parallel stream depends on it.

| Files | Change |
|---|---|
| docs/PRODUCT-DIRECTION.md | Remains the product source of truth |
| docs/IMPLEMENTATION-MAP.md | Execution source of truth; update decisions and completion state |
| src/lib/content-types.ts | Define canonical content kinds and strict frontmatter contracts; include the twelve business sections |
| src/lib/mdx.ts | Replace broad silent catches with typed errors and build-time validation |
| src/lib/site.ts | Centralize brand name, positioning, nav, CTA, contact, and canonical base URL |
| src/app/globals.css | Introduce semantic navy, ivory, champagne, sage, text, border, focus, and error tokens; add reduced-motion defaults |
| tailwind.config.* | Map semantic tokens and typography if Tailwind remains the styling boundary |
| next.config.ts | Add permanent legacy-route redirects and explicit image/security settings |
| package.json | Align eslint-config-next with Next; add typecheck and content-validation scripts |

Acceptance:

- Invalid MDX/frontmatter fails loudly with the file path and field name.
- No page owns a separate copy of route labels, brand copy, or design tokens.
- Legacy URLs resolve in one redirect hop.

### WS1 - Global shell, brand system, and accessibility

Owner: frontend shell agent. Can start after WS0 contracts freeze.

| Files | Change |
|---|---|
| src/app/layout.tsx | New metadata defaults, language, font strategy, skip link, and minimal global client providers |
| src/components/layout/Header.tsx | Target navigation, mobile keyboard behavior, active states, and the canonical conversation CTA |
| src/components/layout/Footer.tsx | New information architecture, legal/contact links, restrained subscription surface |
| src/components/layout/SearchBubble.tsx | Remove unused import; align search destinations with canonical routes; improve dialog semantics |
| src/components/layout/RecruitmentBubble.tsx | Remove from global shell or restyle only if it remains strategically justified |
| src/components/layout/BookingModal.tsx | Align form language and accessibility; consume secure API contract from WS4 |
| src/components/ui/ScrollReveal.tsx | Respect prefers-reduced-motion and avoid content invisibility without JavaScript |
| src/components/reading/ReadingContext.tsx | Preserve reading preferences without hydration or accessibility regressions |
| src/components/reading/ReadingControls.tsx | Restyle against semantic tokens; verify focus and mobile use |

Acceptance:

- Header and footer are the same across all canonical routes.
- Full navigation and dialogs work by keyboard, with visible focus and correct labels.
- Reduced-motion mode removes nonessential motion.

### WS2 - Content domain and editorial components

Owner: content-system agent. Can run parallel with WS1 after WS0.

| Files | Change |
|---|---|
| content/business/*.mdx | Migrate each analysis to the required twelve-section contract |
| content/frameworks/*.mdx | Align terminology, route references, summaries, and CTA language |
| content/psychology/*.mdx | Establish psychology as an equal pillar, not a supporting category |
| content/articles/*.mdx | Update voice, taxonomy, route references, and related-content metadata |
| src/components/article/ArticleLayout.tsx | Canonical article structure, author/date semantics, CTA, and new visual system |
| src/components/article/BusinessAnalysisLayout.tsx | Render and visibly order all twelve required business-analysis sections |
| src/components/article/RelatedPosts.tsx | Generate canonical Vietnamese URLs and handle sparse content safely |
| src/components/article/ReadingProgress.tsx | Keep behavior but respect reduced motion and template boundaries |
| src/components/mdx/* | Standardize callouts, figures, tables, citations, and long-form spacing |
| src/components/ui/PostCard.tsx | One reusable editorial card model with accessible links and stable image ratios |
| src/components/ui/ContentCarousel.tsx | Keep only if it improves discovery; otherwise replace with a simpler responsive grid |
| src/lib/related.ts | Use canonical types/routes and deterministic fallback rules |
| test-mdx.ts | Convert or replace with a repeatable content-validation command |

Acceptance:

- Every business page exposes all twelve sections in the correct order.
- No internal content link points to a legacy route.
- Empty or partial collections fail gracefully without hiding malformed content.

### WS3 - Homepage and canonical pages

Owner: page-composition agent. Starts after WS0 and consumes WS1/WS2 primitives.

| Files | Change |
|---|---|
| src/app/page.tsx | Rebuild in exact order: Hero, Pain, Audience, Beliefs, Framework, Businesses, Psychology, Inspiration, Manifesto, CTA |
| src/app/triet-ly/page.tsx | New philosophy narrative sourced from current about content |
| src/app/framework/page.tsx | Canonical framework landing |
| src/app/framework/[slug]/page.tsx | Canonical framework detail and metadata |
| src/app/doanh-nghiep/page.tsx | Business research landing and discovery model |
| src/app/doanh-nghiep/[slug]/page.tsx | Canonical twelve-section detail template |
| src/app/tam-ly/page.tsx | Psychology pillar landing |
| src/app/tam-ly/[slug]/page.tsx | Psychology detail |
| src/app/bai-viet/page.tsx | Editorial index with useful taxonomy |
| src/app/bai-viet/[slug]/page.tsx | Editorial detail |
| src/app/dong-hanh/page.tsx | Trust-led advisory page connected to secure booking |
| src/app/lien-he/page.tsx | Contact options and expectations |
| src/app/chinh-sach-bao-mat/page.tsx | Privacy policy |
| src/app/dieu-khoan-su-dung/page.tsx | Terms |
| src/app/not-found.tsx | New shell and canonical discovery paths |
| src/app/loading.tsx | Token-based loading UI without excessive motion |
| src/app/series/page.tsx | Fix href={article.slug}; keep only with a clear editorial role |
| src/app/library/page.tsx | Remove or resolve dead /library/books, /quotes, /glossary links |

Acceptance:

- Homepage section order and exact CTA copy match the canonical brief.
- Every primary page has unique title, description, heading, and next action.
- No placeholder, dead link, or mixed old/new brand language remains.

### WS4 - APIs, privacy, and operational safety

Owner: backend/security agent. Can run parallel after WS0; blocks CTA cutover.

| Files | Change |
|---|---|
| src/app/api/booking/route.ts | Remove default secret; validate schema; sanitize email HTML; add idempotency and rate limiting |
| src/app/api/booking/confirm/route.ts | Replace state-changing GET and shared token with signed, expiring, single-purpose action; make replay safe |
| src/app/api/booking/reschedule/route.ts | Validate authorization/input; create replacement before deleting the old event or add compensating rollback |
| src/app/api/subscribe/route.ts | Validate email, record consent, deduplicate, support unsubscribe, define persistence and rate limits |
| src/app/api/search/route.ts | Bound query length/results, canonicalize result URLs, avoid returning full content, add cache/rate controls |
| .env.example | Document required secrets and fail-closed behavior without real values |
| docs/API-ROUTES.md | Update contracts, threat model, status codes, and operational setup |
| docs/DEPLOYMENT.md | Add secret rotation, rollback, provider permissions, and launch checklist |

Acceptance:

- Production refuses to start or execute privileged flows without required secrets.
- Admin actions expire, cannot be replayed, and do not mutate state via GET.
- No raw user/provider error is interpolated into HTML.
- Lead collection has consent, retention, unsubscribe, and privacy documentation.

### WS5 - SEO, performance, QA, and release

Owner: lead integrator with a QA agent after feature streams merge.

| Files | Change |
|---|---|
| src/app/sitemap.ts | Emit only canonical routes and actual content timestamps; remove legacy duplicates |
| src/app/robots.ts | Verify production host and sitemap |
| All page.tsx files | Add consistent generateMetadata, canonical URLs, Open Graph, and structured data where useful |
| public/images/* | Replace or compress old mist imagery; define art direction and responsive sizes |
| public/videos/* | Confirm each video is used, compressed, poster-backed, lazy-loaded, and motion-safe |
| eslint.config.mjs | Exclude skill fixtures if they are not product source; retain strict checks for app code |
| package.json | Add route/content/link smoke tests and repeatable QA scripts |

Required verification:

- npm run lint
- npm run typecheck
- npm run build
- Content-schema validation
- Canonical-route and redirect smoke tests
- Broken internal-link scan
- Keyboard, focus, contrast, and reduced-motion pass
- Mobile widths 320, 375, 768 and desktop 1280+
- Booking, confirmation, reschedule, subscription, and search failure-path tests
- Lighthouse or equivalent checks for the homepage and each page template

## 4. Execution sequence and parallel ownership

Gate 0 baseline -> Wave 1 WS0 contracts -> Wave 2 WS1 shell plus WS2 content plus WS4 security in parallel -> Wave 3 WS3 pages -> Wave 4 WS5 integration and release.

Recommended team shape:

| Lane | Scope | May edit | Must not edit |
|---|---|---|---|
| Lead integrator | WS0, merge contract, final WS5 | shared config, src/lib, route cutover, QA docs | avoid simultaneous page styling while agents own it |
| Agent A | WS1 | global shell and shared UI only | content schemas, API routes |
| Agent B | WS2 then WS3 content pages | content, article components, assigned pages | global shell, API routes |
| Agent C | WS4 then security QA | API routes, env/docs, API tests | visual components |

Rules for parallel work:

- Freeze shared types, route helpers, tokens, and site config before delegation.
- Give each agent a non-overlapping file allowlist and explicit acceptance tests.
- Agents report findings and patches; the lead owns cross-stream integration.
- Merge in dependency order: WS0, WS1/WS2/WS4, WS3, WS5.
- Run the full verification suite after every integration wave, not only at the end.

## 5. Commit and rollback plan

Use small, reversible commits:

1. chore: add route, content, and design contracts
2. feat: rebuild global shell and tokens
3. feat: migrate content schemas and editorial components
4. fix: secure booking, subscription, and search APIs
5. feat: add canonical routes and homepage
6. chore: add redirects, metadata, sitemap, and asset optimization
7. test: add regression and release checks

Keep legacy routes as redirects for at least one release cycle. Do not combine content migration, security changes, and visual cutover in a single commit.

## 6. Definition of done

- The visible product consistently communicates the canonical owner-mindset positioning.
- Psychology and business analysis are equal pillars.
- All canonical routes exist; legacy routes redirect; no internal link uses a legacy path.
- Every business analysis satisfies the twelve-section standard.
- Security P0 items are closed before booking and subscription are promoted.
- Lint, type check, build, content validation, route tests, and accessibility smoke tests pass.
- Documentation reflects the shipped system, and this map records any approved deviations.
