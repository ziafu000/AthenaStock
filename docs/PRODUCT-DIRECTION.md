# AthenaStock Product Direction

> **Scope:** This document is the source of truth for product positioning, audience, voice, content standards, and business rules. It does not authorize UI/UX changes. The committed frontend is the approved visual and interaction baseline.

## Frontend Preservation Decision

- Preserve the current layout, navigation, routes, components, typography, colors, motion, and responsive behavior.
- Do not rebuild the homepage, rename public routes, replace the design system, or restyle shared components as part of the current initiative.
- Frontend changes require an explicit future request. Essential bug, accessibility, or security fixes must be minimal and visually regression-tested.
- Backend, security, content validation, data quality, SEO correctness, testing, and operational reliability may continue when they do not alter the approved frontend.

## North Star

AthenaStock is an **Investment Thinking House**: a place that builds durable investing capability, not a website that sells stock ideas.

- Core message: invest with the mindset of a business owner.
- Product promise: help investors understand businesses, use a repeatable decision framework, and manage their own psychology.
- Mindful investing remains the psychology pillar within the larger Athena philosophy.

AthenaStock does not provide hot picks, signals, fast-rich promises, performance claims, or pressure-based calls to action.

## Audience and Brand Voice

The primary audience is serious, long-term individual investors who want to improve how they think and make decisions: investors who already have capital, investors building a repeatable framework, serious beginners, and people disappointed by speculative market culture.

Do not optimize the product for hot-stock seekers, signal followers, short-term excitement, or anyone expecting quick and certain returns.

The voice is calm, deep, kind, systematic, philosophical, direct, and clear. Copy should be concise and grounded in evidence. Avoid hype, FOMO, urgency, and certainty that the evidence cannot support.

## Product Pillars

1. Athena philosophy and principles.
2. A repeatable investment framework.
3. Structured, evidence-based company research.
4. Investment psychology and behavioral awareness.
5. Long-form writing connecting philosophy, business, valuation, and psychology.
6. Calm, transparent ways to learn or work with Athena.

These pillars guide content and business decisions only. They do not imply a new navigation, route structure, or page layout.

## Company Research Standard

Every company analysis should contain these 12 sections in this order. The Vietnamese labels below are the exact level-two MDX headings enforced by the runtime contract:

1. Overview / `Tổng quan`
2. Business model / `Mô hình kinh doanh`
3. Competitive advantage / `Lợi thế cạnh tranh`
4. Management / `Ban lãnh đạo`
5. Financial quality / `Chất lượng tài chính`
6. Growth drivers / `Động lực tăng trưởng`
7. Risks / `Rủi ro`
8. Valuation / `Định giá`
9. Margin of safety / `Biên an toàn`
10. Investment thesis / `Luận điểm đầu tư`
11. What could invalidate the thesis / `Điều gì khiến luận điểm sai`
12. Research update date / `Ngày cập nhật nghiên cứu`

Research must separate facts, assumptions, and judgment; show risks and disconfirming evidence; cite sources; and state when it was last reviewed. It must never be framed as a buy/sell signal.

## Implementation Guardrails

- Preserve the current Next.js, React, TypeScript, Tailwind, MDX, search, booking, email, SEO, static-content, and frontend foundations unless a concrete technical limitation requires change.
- Improve content schemas and validation without changing how approved pages look or behave.
- Keep claims educational and compliant. Privacy, terms, consent, and disclaimers may be strengthened without redesigning the frontend.
- Security-sensitive flows must fail closed, validate external input, escape output, and avoid state-changing GET requests.
- Update documentation whenever a product or technical decision changes.

## Source Priority

When deciding what to build, use this order:

1. This product-direction document and explicitly approved user decisions
2. Current committed frontend for all UI/UX behavior
3. Technical, content, API, and deployment documentation
4. The approved master handout only for non-UI product and content guidance

If a future decision materially changes this direction, update this document first, then sync dependent docs and code.
