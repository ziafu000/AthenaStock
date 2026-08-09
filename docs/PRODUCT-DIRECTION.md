# AthenaStock Product Direction

> **Canonical source of truth for the redesign.** Read this document before changing product copy, information architecture, content templates, UI, or visual design. When older docs or the current implementation conflict with this direction, this document wins.

## North Star

AthenaStock is an **Investment Thinking House**: a place that builds durable investing capability, not a website that sells stock ideas.

- Core message: **Đầu tư như một người chủ doanh nghiệp.**
- Supporting message: **Hiểu doanh nghiệp. Hiểu chính mình. Xây dựng tài sản bền vững.**
- Product promise: help investors understand businesses, use a repeatable decision framework, and manage their own psychology.
- Mindful investing remains important, but becomes the psychology pillar within the larger Athena philosophy.

AthenaStock does not provide hot picks, signals, fast-rich promises, performance claims, or pressure-based calls to action.

## Audience and Brand Voice

The primary audience is serious, long-term individual investors who want to improve how they think and make decisions: investors who already have capital, investors building a repeatable framework, serious beginners, and people disappointed by speculative market culture.

Do not optimize the product for hot-stock seekers, signal followers, short-term excitement, or anyone expecting quick and certain returns.

The voice is calm, deep, kind, systematic, philosophical, direct, and clear. Copy should be concise and grounded in evidence. Avoid showing off, hype, FOMO, urgency, and certainty that the evidence cannot support.

## Product Pillars

1. **Triết lý Athena** — the worldview and principles behind business-owner investing.
2. **Framework** — a repeatable five-step process: understand the business, estimate value, demand a margin of safety, decide, and manage emotions.
3. **Doanh nghiệp** — structured, evidence-based company research.
4. **Tâm lý đầu tư** — understand, recognize, and adjust behavioral patterns to make better decisions.
5. **Bài viết** — long-form thinking that connects philosophy, business, valuation, and psychology.
6. **Đồng hành** — calm, transparent ways to learn or work with Athena.

## Target Information Architecture

Primary navigation:

- Triết lý Athena
- Framework
- Doanh nghiệp
- Tâm lý đầu tư
- Bài viết
- Đồng hành

Header CTA: **Trao đổi cùng Athena**. About content belongs under Triết lý Athena and in the footer rather than as a primary navigation item.

Target public routes:

| Route | Purpose |
|---|---|
| /triet-ly | Athena philosophy and principles |
| /framework | Five-step investment framework |
| /doanh-nghiep | Company research library |
| /doanh-nghiep/[slug] | Structured company research |
| /tam-ly | Investment psychology library |
| /bai-viet | Article library |
| /bai-viet/[slug] | Article detail |
| /dong-hanh | Ways to work or learn with Athena |
| /lien-he | Contact |
| /chinh-sach-bao-mat | Privacy policy |
| /dieu-khoan-su-dung | Terms of use |

Legacy English routes describe the current implementation, not the redesign target. Migrate them deliberately with redirects and preserved SEO metadata.

## Homepage Narrative

The homepage must follow this sequence:

1. Hero
2. Investor pain
3. Who Athena is for
4. Core beliefs
5. Five-step framework
6. Company research
7. Investment psychology
8. Sources of inspiration
9. Manifesto
10. Final CTA

Hero copy:

- Headline: **Đầu tư như một người chủ doanh nghiệp.**
- Supporting line: **Hiểu doanh nghiệp. Hiểu chính mình. Xây dựng tài sản bền vững.**
- Primary CTA: **Khám phá Triết lý Athena**
- Secondary CTA: **Đọc một bài phân tích mẫu**

The beliefs section must communicate: a stock is a business, price is not value, margin of safety matters, and psychology shapes outcomes.

The psychology journey is: **Hiểu → Nhận diện → Điều chỉnh → Ra quyết định tốt hơn.**

The named sources of inspiration are Benjamin Graham, Warren Buffett, Charlie Munger, and Thích Nhất Hạnh. Present them as intellectual foundations, never as borrowed authority or hero worship.

## Company Research Standard

Every company detail page uses these 12 sections in this order:

1. Tổng quan
2. Mô hình kinh doanh
3. Lợi thế cạnh tranh
4. Ban lãnh đạo
5. Chất lượng tài chính
6. Động lực tăng trưởng
7. Rủi ro
8. Định giá
9. Biên an toàn
10. Luận điểm đầu tư
11. Điều gì khiến luận điểm sai
12. Ngày cập nhật nghiên cứu

Research must separate facts, assumptions, and judgment; show risks and disconfirming evidence; cite sources; and state when it was last reviewed. It must never be framed as a buy/sell signal.

## Visual Direction

The visual language combines an investment institution, a modern editorial publication, and calm intelligence.

- Colors: deep navy, ivory, muted gold/champagne, and soft sage. Red is reserved for warnings and errors.
- Typography: premium serif for editorial authority, modern sans-serif for navigation and utility text.
- Layout: generous whitespace, clear grids, restrained cards, light borders and shadows, modest corner radii.
- Imagery: annual reports, real businesses, research spaces, books, architecture, nature, and reflection.
- Avoid: trading screens, green/red chart clichés, cash imagery, get-rich visuals, glass-heavy interfaces, and decorative complexity.
- Motion: subtle and purposeful; never compete with reading.

## Component and Data Direction

Build reusable, data-driven components instead of page-specific duplicated markup. The minimum target system includes:

- Header, responsive navigation, Footer
- Hero, SectionHeading, CTAGroup
- PrincipleCard, FrameworkStep, CompanyCard, PsychologyTopicCard, InspirationCard, ArticleCard
- QuoteBlock, DarkStatementSection, Breadcrumb
- Search, Filter, Pagination or LoadMore
- Disclaimer

Mobile-first behavior, accessibility, SEO, performance, and reduced-motion support are part of the definition of done.

## Implementation Guardrails

- Preserve the current Next.js, React, TypeScript, Tailwind, MDX, search, booking, email, SEO, and static-content foundations unless a concrete technical limitation requires change.
- Treat the redesign as a product-system change, not a color/theme swap.
- Replace legacy positioning, navigation, homepage flow, route naming, and visual tokens incrementally while keeping the site operable.
- Do not let existing English routes, the old wine/crimson palette, carousel-led presentation, or the phrase “Ngủ ngon với tiền của bạn” constrain the target experience.
- Keep claims educational and compliant. Add visible disclaimers plus privacy and terms pages.

## Source Priority

When deciding what to build, use this order:

1. This product-direction document and the approved master handout
2. Content and architecture docs updated to reference it
3. Existing implementation details

If a future decision materially changes this direction, update this document first, then sync the dependent docs and code.
