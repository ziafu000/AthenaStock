# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## Verification & Build
- `npm run verify` runs content validation, route validation, TypeScript checking, ESLint, and Next.js build.
- Database migrations live in `database/migrations/*.sql` and are tracked in `public.schema_migrations`. Run `npm run migrate` to apply new migrations idempotently.
- When adding public routes or internal links, update `publicRoutes` in `scripts/validate-routes.mjs` and `staticRoutes` in `src/app/sitemap.ts` to keep contracts aligned.

## Architecture
- Content: MDX articles in `content/` validated by `test-mdx.ts`.
- Member auth & VIP: HMAC SHA-256 session cookie (`athena_member_session`) in `src/lib/member/auth.ts`.
- VIP-first 8h access gate in `src/lib/member/vip-access.ts` locks research posts for 8 hours unless VIP or Global VIP Override (`GLOBAL_VIP_OVERRIDE=true`).
- Admin panel: `/admin/bookings` for consultation bookings and `/admin/vip` for reviewing VIP upgrade payments.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
