# AthenaStock Implementation Map

Status: WS0-WS3 hoàn tất trong code ngày 2026-08-13. Production còn cần chạy migration `008`, deploy và smoke test.
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

### WS0 - Baseline and contracts — complete

Owner: lead integrator. Lands first.

| Files | Change |
|---|---|
| docs/PRODUCT-DIRECTION.md | Record frontend freeze and product/content rules |
| docs/IMPLEMENTATION-MAP.md | Execution source of truth |
| src/lib/content-types.ts | Define strict content/frontmatter contracts and the 12 business sections |
| src/lib/mdx.ts | Replace silent failures with typed, file-specific validation errors |
| package.json | Add validation/typecheck/test scripts only when required |

Acceptance:

- [x] The committed frontend is captured as the regression baseline.
- [x] Invalid content fails with file path and field name.
- [x] Shared config and dependency changes remain owned by the lead integrator.

### WS1 - Content integrity and link correctness — complete

| Files | Change |
|---|---|
| content/business/*.mdx | Validate and incrementally fill the required 12 sections |
| content/framework/*.mdx | Validate frontmatter and internal links |
| content/psychology/*.mdx | Validate frontmatter and internal links |
| content/article/*.mdx | Validate taxonomy and related-content metadata |
| src/lib/related.ts | Make fallback behavior deterministic without changing presentation |
| test-mdx.ts | Convert or replace with a repeatable validation command |

Acceptance:

- [x] Every business analysis satisfies the 12-section contract or fails validation clearly.
- [x] Dead or malformed internal links are detected.
- [x] No page layout, component API, or styling changes.

Verification on 2026-08-12:

- `npm run validate:content`: passed for 4 content files; 0 internal links currently present.
- Negative validation test: passed; the error identifies both `content/article/broken.mdx` and invalid field names.
- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 3 pre-existing warnings outside this workstream.
- `npm run build`: production build passed; all current static content routes generated.

### WS2 - Booking and API safety — complete

| Files | Change |
|---|---|
| src/app/api/booking/route.ts | Remove default secret; validate input; escape email content; add idempotency and rate limiting |
| src/app/api/booking/confirm/route.ts | Replace state-changing GET; use signed, expiring, single-purpose, replay-safe actions |
| src/app/api/booking/reschedule/route.ts | Validate authorization/input and make replacement atomic or recoverable |
| src/lib/booking/* | Database access, validation, signed action tokens, safe HTML, email, and ICS generation |
| database/migrations/* | Booking/subscription schema, slot uniqueness, delivery state, consent, and audit timestamps |
| src/app/api/subscribe/*, src/lib/subscriptions.ts | Validate/deduplicate email; persist consent; add one-time unsubscribe and rate limits |
| src/app/api/search/route.ts | Bound queries/results, avoid returning excessive content, add cache/rate controls |
| docs/DEPLOYMENT.md | Document required secrets and fail-closed behavior without real values |
| docs/API-ROUTES.md | Maintain API contracts, threat model, status codes, and setup |
| docs/DEPLOYMENT.md | Maintain secret rotation, rollback, permissions, and launch checks |

Acceptance:

- [x] Privileged flows fail closed when configuration is missing.
- [x] Admin actions expire, cannot be replayed, and do not mutate state via public GET routes.
- [x] No raw user or provider error is interpolated into HTML.
- [x] Booking uses a provider-independent database/email/ICS design without changing the existing modal UI.
- [x] Subscription consent, deduplication, one-time unsubscribe and email delivery use PostgreSQL/outbox.
- [x] Search query/result bounds, minimal response fields, shared rate limits and cache headers are enforced.

### WS3 - Tests, SEO correctness, and release safety — complete

| Files | Change |
|---|---|
| src/app/sitemap.ts | Include only real current routes and correct timestamps |
| src/app/robots.ts | Verify production host and sitemap |
| eslint.config.mjs | Keep strict checks focused on product code |
| package.json | Add content, route, link, and API regression commands |
| docs/* | Keep shipped behavior and operational procedures synchronized |

Acceptance:

- [x] Lint, typecheck, and production build pass.
- [x] Content-schema, internal-link, route-contract, sitemap, and robots checks are automated.
- [x] A non-mutating HTTP smoke command covers every public route and critical API failure paths.
- [x] No visual frontend behavior or styling changed in this workstream.

Verification on 2026-08-13:

- `npm run test`: passed for 4 content files, 10 public routes, and route/link scans across 79 source files.
- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 0 warnings.
- `npm run build`: production build passed and generated 36 routes; only the informational stale `caniuse-lite` notice remains.
- Production HTTP smoke remains the final post-deploy gate.

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

## 6. Booking completion target

Phần này là source of truth cho booking hiện tại. Phần triển khai chỉ bổ sung UI cần thiết cho booking và không redesign frontend công khai.

### Invariants

- PostgreSQL là nguồn sự thật duy nhất cho slot, trạng thái booking, action một lần và email job.
- Slot của `confirmed` và `reschedule_requested` không xuất hiện là khả dụng. Request `pending` không giữ slot; nhiều khách vẫn có thể cùng yêu cầu cho tới khi một request được xác nhận.
- `POST /api/booking` và mọi action xác nhận phải kiểm tra lại slot trong transaction; availability phía client chỉ là UX, không phải khóa dữ liệu.
- Ngày sớm nhất là ngày mai theo `Asia/Ho_Chi_Minh` ở cả client và server.
- Public GET chỉ đọc/preview. Confirm, reschedule, cancel và login đều thay đổi state bằng POST. Route worker nội bộ vẫn nhận GET có `CRON_SECRET` vì đó là contract bắt buộc của Vercel Cron; POST dùng cho kích hoạt thủ công.
- Token cho action nhạy cảm có purpose, expiry và bản ghi one-time-use trong database.
- Email nghiệp vụ được enqueue cùng transaction với thay đổi booking, rồi worker gửi và retry; request người dùng không chờ Resend.
- Không xóa booking khi cancel; giữ audit trail và phát hành `.ics` cancellation nếu booking từng được xác nhận.
- Link phòng họp chỉ được tạo khi slot được xác nhận, lưu một lần trong database và tái sử dụng khi retry.
- Public UI chỉ nhận thay đổi tối thiểu trong modal booking: trạng thái tải slot, disable slot hết chỗ, CAPTCHA và thông báo conflict.

## 7. Booking workstreams and file map

| Workstream | Shipped files | Result |
|---|---|---|
| B0 - policy | `policy.ts`, `types.ts`, `validation.ts`, `BookingModal.tsx` | Một timezone, sáu slot và ngày tối thiểu là ngày mai ở client/server |
| B1 - workflow | migrations `004`-`008`, `db.ts`, `database.ts`, `actions.ts`, `outbox.ts`, `email-worker.ts`, `vercel.json` | Action token hash-at-rest, transaction, email outbox, retry/dead-letter và giữ slot cũ khi reschedule |
| B2 - availability | `/api/booking/availability`, `BookingModal.tsx` | Disable slot đã giữ; transaction vẫn chặn race bằng `409` |
| B3 - admin | `admin-auth.ts`, `/api/admin/auth/*`, `/api/admin/session`, `/api/admin/bookings*`, `/admin/bookings` | Magic-link session và danh sách/filter/cancel booking |
| B4 - self-service | `/api/booking/reschedule`, `/api/booking/respond`, `/booking/respond`, `/api/booking/cancel`, `/booking/cancel` | Khách chọn slot mới hoặc hủy qua explicit POST; email dùng `.ics` REQUEST/CANCEL |
| B5 - abuse controls | migration `006`, `rate-limit.ts`, `captcha.ts`, `TurnstileWidget.tsx` | Rate limit không lưu IP thô và Turnstile fail-closed ở production |
| B6 - meeting | `meeting.ts`, confirm/respond transitions | Tạo một room URL khi confirmed, persist và tái sử dụng khi retry |
| B7 - operations | `API-ROUTES.md`, `DEPLOYMENT.md`, `database/README.md` | Hướng dẫn migration, env, worker chạy sau action, Cron Hobby hằng ngày, rollback và smoke test |

### Release status

- Typecheck, lint và production build là gate bắt buộc trước khi commit/deploy.
- Automated route/link contracts and a non-mutating HTTP smoke suite are included. Database-concurrency, full browser E2E, and successful write/email flows remain manual production checks in `DEPLOYMENT.md`.
- Migrations là additive/forward-only. Khi rollback code, không xóa migration đã áp dụng hoặc lịch sử booking.
