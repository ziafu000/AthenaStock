# AthenaStock Implementation Map

Status: WS2 database + email + ICS implementation landed; remaining gates still apply
Canonical direction: [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md)

## 1. Scope and release gates

### Approved baseline

- The current committed frontend is the approved UI/UX baseline.
- No planned redesign of pages, navigation, routes, components, typography, colors, spacing, motion, or responsive behavior.
- Existing frontend feature descriptions remain documentation of shipped behavior.

### In scope

- Booking/API security and provider-independent booking architecture.
- Content schema enforcement, especially the 12-part company-analysis standard.
- Input validation, output escaping, idempotency, expiry, replay protection, and rate limiting.
- Broken-link repair that preserves existing routes and presentation.
- Automated tests, build checks, observability, privacy, consent, and deployment safety.

### Out of scope

- Homepage rebuild or new narrative layout.
- New navigation or Vietnamese route migration.
- New design tokens, palette, typography, imagery, motion, cards, or shared shell.
- Restyling reading controls, search, booking, article templates, or content pages.

| Gate | Must be true |
|---|---|
| P0 - security | No fallback secrets; privileged actions are signed, expiring, single-purpose, and replay-safe; no state-changing GET; external input is validated and escaped |
| P1 - content | Company research schema enforces the approved 12 sections and reports actionable validation errors |
| P1 - regression | Existing routes, frontend behavior, metadata, links, build, lint, and type checks pass |
| P2 - operations | Consent, persistence, rate limiting, observability, rollback, and provider setup are documented and tested |

Do not promote booking publicly until its P0 gate passes.

## 2. Workstreams and file ownership

### WS0 - Baseline and contracts

Owner: lead integrator. Lands first.

| Files | Change |
|---|---|
| docs/PRODUCT-DIRECTION.md | Record frontend freeze and product/content rules |
| docs/IMPLEMENTATION-MAP.md | Execution source of truth |
| src/lib/content-types.ts | Define strict content/frontmatter contracts and the 12 business sections |
| src/lib/mdx.ts | Replace silent failures with typed, file-specific validation errors |
| package.json | Add validation/typecheck/test scripts only when required |

Acceptance:

- The committed frontend is captured as the regression baseline.
- Invalid content fails with file path and field name.
- Shared config and dependency changes remain owned by the lead integrator.

### WS1 - Content integrity and link correctness

| Files | Change |
|---|---|
| content/business/*.mdx | Validate and incrementally fill the required 12 sections |
| content/frameworks/*.mdx | Validate frontmatter and internal links |
| content/psychology/*.mdx | Validate frontmatter and internal links |
| content/articles/*.mdx | Validate taxonomy and related-content metadata |
| src/lib/related.ts | Make fallback behavior deterministic without changing presentation |
| test-mdx.ts | Convert or replace with a repeatable validation command |

Acceptance:

- Every business analysis satisfies the 12-section contract or fails validation clearly.
- Dead or malformed internal links are detected.
- No page layout, component API, or styling changes.

### WS2 - Booking and API safety

| Files | Change |
|---|---|
| src/app/api/booking/route.ts | Remove default secret; validate input; escape email content; add idempotency and rate limiting |
| src/app/api/booking/confirm/route.ts | Replace state-changing GET; use signed, expiring, single-purpose, replay-safe actions |
| src/app/api/booking/reschedule/route.ts | Validate authorization/input and make replacement atomic or recoverable |
| src/lib/booking/* | Database access, validation, signed action tokens, safe HTML, email, and ICS generation |
| database/migrations/* | Booking schema, slot uniqueness, delivery state, and audit timestamps |
| src/app/api/subscribe/route.ts | Validate/deduplicate email; record consent; define persistence, unsubscribe, and rate limits |
| src/app/api/search/route.ts | Bound queries/results, avoid returning excessive content, add cache/rate controls |
| docs/DEPLOYMENT.md | Document required secrets and fail-closed behavior without real values |
| docs/API-ROUTES.md | Maintain API contracts, threat model, status codes, and setup |
| docs/DEPLOYMENT.md | Maintain secret rotation, rollback, permissions, and launch checks |

Acceptance:

- Privileged flows fail closed when configuration is missing.
- Admin actions expire, cannot be replayed, and do not mutate state via GET.
- No raw user or provider error is interpolated into HTML.
- Booking can use an approved provider-independent design without changing the existing modal UI.

### WS3 - Tests, SEO correctness, and release safety

| Files | Change |
|---|---|
| src/app/sitemap.ts | Include only real current routes and correct timestamps |
| src/app/robots.ts | Verify production host and sitemap |
| eslint.config.mjs | Keep strict checks focused on product code |
| package.json | Add content, route, link, and API regression commands |
| docs/* | Keep shipped behavior and operational procedures synchronized |

Required verification:

- Lint, typecheck, and production build.
- Content-schema and broken-link checks.
- Smoke tests for every existing public route.
- Booking, confirmation, reschedule, subscription, and search failure paths.
- Visual regression or screenshot comparison for any unavoidable frontend-touching fix.

## 3. Execution sequence

1. WS0: freeze contracts and record current frontend baseline.
2. WS1 and WS2 may run in parallel with non-overlapping file ownership.
3. WS3 integrates and verifies the whole system.
4. The lead reviews the final diff and rejects incidental frontend changes.

For parallel agents, shared config, manifests, lockfiles, dependencies, final integration, and full test runs stay with the lead.

## 4. Commit and rollback plan

Use small, reversible commits:

1. docs: freeze current frontend direction
2. test: add content and route regression checks
3. fix: enforce content contracts and repair links
4. fix: secure booking, subscription, and search APIs
5. chore: add operational and release checks

Do not combine content migration, security work, and any frontend-touching fix in one commit.

## 5. Definition of done

- The current frontend remains visually and behaviorally unchanged.
- Every company analysis satisfies the 12-section standard.
- P0 security issues are closed before booking or subscription is promoted.
- Existing routes and links work; no route migration is introduced.
- Lint, typecheck, build, content validation, route tests, and API failure-path tests pass.
- Documentation describes the shipped system and records approved deviations.
