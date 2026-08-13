# Content Creation Guide

## Overview

> [PRODUCT-DIRECTION.md](./PRODUCT-DIRECTION.md) is the canonical source for positioning, audience, voice, and content standards. The current committed frontend remains the UI/UX source of truth.

AthenaStock is an Investment Thinking House. Write in a calm, deep, kind, systematic, and philosophical voice. Be direct, concise, and clear. Teach readers to understand businesses, make decisions with a framework, and manage their own psychology. Never publish tips, signals, FOMO hooks, performance promises, or guaranteed-return language.

This guide covers how to create, structure, and publish content on Athena Stock. All content is stored as MDX files in the \content/\ directory.

---

## Content Types

### 1. Article (\rticle\)

**Purpose:** Investment philosophy, fundamental concepts, long-term thinking

**Location:** \content/article/\

**Route:** \/articles/[slug]\

**Frontmatter Schema:**

\\\yaml
---
title: "Article Title"
description: "SEO description (max 155 characters)"
date: "2024-01-15"
updatedAt: "2024-01-20"              # Optional
type: "article"
tags: ["philosophy", "buffett", "value-investing"]
readingTime: "5 min"
series: "Foundation Series"           # Optional
---
\\\

**Example:**

\\\markdown
---
title: "Triết lý đầu tư dài hạn"
description: "Tại sao kiên nhẫn là yếu tố quyết định thành công trong đầu tư"
date: "2024-03-15"
type: "article"
tags: ["philosophy", "long-term"]
readingTime: "8 min"
---

## Giới thiệu

Thị trường chứng khoán là công cụ chuyển tiền từ túi người thiếu kiên nhẫn sang túi người kiên nhẫn...
\\\

---

### 2. Business Analysis (\usiness\)

**Purpose:** Deep-dive analysis of companies and business models

**Location:** \content/business/\

**Route:** \/business/[slug]\

**Frontmatter Schema:**

\\\yaml
---
title: "Company Name: Analysis Title"
description: "Brief analysis summary"
date: "2024-01-15"
updatedAt: "2024-01-20"              # Optional
type: "business"
tags: ["tech", "bluechip", "dividend"]
tickers: ["FPT", "VNM"]              # Stock symbols
market: "HOSE"                        # HOSE | HNX | UPCOM
sector: "Technology"                  # Optional
riskLevel: "medium"                   # low | medium | high
readingTime: "15 min"
citations:
  - label: "Annual Report 2023"
    url: "https://example.com/report.pdf"
  - label: "Q4 Earnings Call"
    url: "https://example.com/transcript"
---
\\\

**Required Fields:**
- \	ickers\: Array of stock symbols
- \market\: Exchange (HOSE/HNX/UPCOM)
- \iskLevel\: Risk assessment (low/medium/high)
- \citations\: Array of source references

---

### 3. Psychology (\psychology\)

**Purpose:** Behavioral finance, cognitive biases, emotional control

**Location:** \content/psychology/\

**Route:** \/psychology/[slug]\

**Frontmatter Schema:**

\\\yaml
---
title: "Bias/Concept Name"
description: "How this affects investment decisions"
date: "2024-01-15"
type: "psychology"
tags: ["bias", "fomo", "loss-aversion"]
readingTime: "6 min"
relatedBiases: ["Confirmation Bias", "Anchoring"]  # Optional
---
\\\

---

### 4. Framework (\ramework\)

**Purpose:** Checklists, evaluation frameworks, decision-making tools

**Location:** \content/framework/\

**Route:** \/frameworks/[slug]\

**Frontmatter Schema:**

\\\yaml
---
title: "Framework Name"
description: "What this framework helps evaluate"
date: "2024-01-15"
type: "framework"
tags: ["checklist", "valuation", "quality"]
difficulty: "intermediate"            # beginner | intermediate | advanced
readingTime: "10 min"
downloadable: true                    # Optional: if checklist can be downloaded
---
\\\

---

## Canonical Business Analysis Template (12 Required Sections)

Every new or migrated company research page must use these sections in order:

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

Separate facts, assumptions, and judgment; cite sources; expose uncertainty; include the last-reviewed date; and never turn research into a buy/sell instruction.

## Legacy 10-Section Reference (Deprecated)

The material below documents the previous format for migration reference only. Do not use it as the structure for new content.

### Section 1: Summary

Brief 3-bullet overview:

\\\markdown
## 1. Summary

- **Business Model:** What the company does and how it makes money
- **Competitive Position:** Market position and key advantages
- **Financial Health:** Revenue growth, profitability, debt levels
\\\

### Section 2: Thesis

\\\markdown
## 2. Thesis (Luận điểm đầu tư)

Why this business is worth attention. State your investment thesis clearly:
- What makes this company interesting?
- What is the long-term opportunity?
- What competitive advantages does it have?
\\\

### Section 3: Evidence & Citations

\\\markdown
## 3. Evidence & Citations

All claims must be backed by evidence. Cite sources:

- Revenue grew 15% YoY in 2023 [^1]
- Market share increased from 25% to 30% [^2]

[^1]: [Annual Report 2023](https://example.com/report.pdf)
[^2]: [Industry Analysis Report](https://example.com/industry.pdf)
\\\

### Section 4: Moat (Competitive Advantages)

\\\markdown
## 4. Moat (Lợi thế cạnh tranh)

Analyze the company's economic moat:

- **Switching Costs:** How hard is it for customers to switch?
- **Network Effects:** Does value increase with more users?
- **Brand Power:** Do customers pay premium for the brand?
- **Cost Advantages:** Scale advantages or proprietary tech?
- **Regulatory Barriers:** Licenses, patents, regulations?
\\\

### Section 5: Management & Capital Allocation

\\\markdown
## 5. Management & Capital Allocation

Evaluate leadership and how they deploy capital:

- **Track Record:** Past performance of management team
- **Capital Allocation:** Dividends, buybacks, reinvestment, M&A
- **Insider Ownership:** Do executives own significant shares?
- **Shareholder Communication:** Are they transparent?
\\\

### Section 6: Key Drivers

\\\markdown
## 6. Key Drivers

What will drive growth over the next 3-5 years?

- Market expansion opportunities
- New product launches
- Operating leverage improvements
- Industry tailwinds
\\\

### Section 7: Risks & What Could Prove Me Wrong

**CRITICAL:** This section is MANDATORY. Use danger callout:

\\\markdown
## 7. Risks & What could prove me wrong

<Callout type="danger" title="Rủi ro trọng yếu">
  **Regulatory Risk:** New regulations could limit growth...
  
  **Competition Risk:** New entrants with better technology...
  
  **Execution Risk:** Management may fail to deliver on expansion plans...
</Callout>

### What could prove me wrong?

Be intellectually honest. What evidence would invalidate your thesis?

- If market share drops below 20% → thesis invalidated
- If margins compress below 15% → business model weakening
- If debt/EBITDA exceeds 3x → financial stress
\\\

### Section 8: Assumptions

\\\markdown
## 8. Assumptions (Giả định)

Explicitly state your key assumptions:

- GDP growth of 6-7% annually
- Market share remains stable at 30%
- Gross margins stay above 40%
- No major regulatory changes
- Management continues current capital allocation policy
\\\

### Section 9: Valuation

**NEVER** give specific price targets. Instead, discuss ranges and scenarios:

\\\markdown
## 9. Valuation (Định giá tham khảo)

⚠️ **Disclaimer:** This is NOT a buy/sell recommendation. These are reference scenarios only.

### DCF Sensitivity Analysis

| Growth Rate | Discount Rate | Value Range |
|-------------|---------------|-------------|
| 8%          | 10%           | 50-60k      |
| 10%         | 10%           | 60-75k      |
| 10%         | 12%           | 55-65k      |

### Multiples Comparison

Current P/E: 18x
Industry average: 15-20x
Historical range: 12-25x

**Key Assumptions:**
- Terminal growth rate: 3%
- WACC: 10-12%
- Margin assumptions: 40% gross, 15% net
\\\

### Section 10: Conclusion - Sleep-Well Test

\\\markdown
## 10. Conclusion: Sleep-well Test

The ultimate question: **If you owned this business and couldn't check the stock price for 5 years, would you sleep well?**

Consider:
- Would the business still exist and be valuable in 5 years?
- Can it survive a major recession?
- Would you be comfortable if the market closed tomorrow for 5 years?

**Personal assessment:** [Your honest conclusion here]
\\\

---

## MDX Components

### Callout Component

Use callouts to highlight important information:

\\\jsx
<Callout type="info" title="Key Insight">
  This is important information that deserves attention.
</Callout>
\\\

**Available Types:**

1. **default** - General notes (gray)
\\\jsx
<Callout type="default" title="Note">
  Regular information
</Callout>
\\\

2. **info** - Important information (blue)
\\\jsx
<Callout type="info" title="Key Point">
  Important insight or data
</Callout>
\\\

3. **warning** - Cautions and warnings (yellow/orange)
\\\jsx
<Callout type="warning" title="Caution">
  Be aware of this limitation or caveat
</Callout>
\\\

4. **danger** - Risks and critical warnings (red)
\\\jsx
<Callout type="danger" title="Major Risk">
  Significant risk that could invalidate thesis
</Callout>
\\\

---

## Writing Guidelines

### FORBIDDEN (Absolutely DO NOT)

❌ **Never use:**
- "Mua ngay" (Buy now)
- "Bán ngay" (Sell now)
- "Target giá X" (Price target X)
- "Vào lệnh" (Enter order)
- "Kèo thơm" (Hot tip)
- "Đánh theo" (Follow the trade)
- "Canh đáy" (Catch the bottom)
- Countdown timers
- Aggressive CTAs
- FOMO language
- Guaranteed returns
- "Best stock ever" superlatives

### REQUIRED (Always Do)

✅ **Always include:**
- Balanced perspective (pros AND cons)
- Risk disclosure section
- "What could prove me wrong" section
- Source citations for all data
- Clear assumptions stated
- Calm, analytical tone
- Long-term perspective

### Tone Guidelines

**Good examples:**
- "The business model appears resilient because..."
- "Historical data suggests..."
- "Key risks include..."
- "Under these assumptions, a reasonable valuation range might be..."

**Bad examples:**
- "This is the BEST stock to buy RIGHT NOW!"
- "Don't miss this opportunity!"
- "Guaranteed 50% returns!"
- "Buy before it's too late!"

---

## Adding New Content

### Step 1: Create MDX File

\\\ash
# Create new article
touch content/article/new-article-slug.mdx

# Create new business analysis
touch content/business/company-name-analysis.mdx
\\\

### Step 2: Add Frontmatter

Copy appropriate template from above and fill in all required fields.

### Step 3: Write Content

Follow the template structure for your content type. For company research, all 12 canonical sections are required.

### Step 4: Test Locally

\\\ash
npm run dev
# Navigate to http://localhost:3000/articles/new-article-slug
\\\

### Step 5: Pre-publish Checklist

Chạy qua checklist này trước mỗi lần publish. Không được bỏ qua bất kỳ mục nào.

**A. Frontmatter & Schema**
- [ ] `title`, `description`, `date`, `type`, `tags`, `readingTime` đã điền đầy đủ
- [ ] `updatedAt` được cập nhật nếu đây là bản sửa (không phải bản gốc)
- [ ] Business: có `tickers`, `market`, `riskLevel`, `citations` — ít nhất 2 nguồn có URL trỏ trang cụ thể
- [ ] Framework: có `difficulty`; Psychology: có `relatedBiases` nếu áp dụng

**B. Phân tách Fact / Inference / Assumption**
- [ ] Mỗi con số hoặc dữ kiện có citation rõ ràng (`[^n]` footnote hoặc inline link)
- [ ] Nhận định/suy luận được gắn nhãn ("Nhận định:", "Giả định:") — không trộn với dữ kiện
- [ ] Không có khẳng định tuyệt đối thiếu bằng chứng ("luôn luôn", "chắc chắn", "tốt nhất")
- [ ] Dự báo tương lai đặt trong điều kiện ("nếu X thì Y", không phải "X sẽ xảy ra")

**C. Citations & Freshness**
- [ ] Mọi citation có URL trỏ nguồn cụ thể (báo cáo, trang IR, tài liệu) — không chỉ domain gốc
- [ ] Không dùng dữ liệu tài chính quá 12 tháng mà không ghi rõ giới hạn thời gian
- [ ] Business research: ghi rõ ngày rà soát và đề xuất lịch review tiếp theo

**D. Internal Links**
- [ ] Bài có ít nhất 1 internal link sang bài loại khác (article ↔ framework ↔ business ↔ psychology)
- [ ] Anchor text mô tả nội dung đích — không dùng "xem tại đây" hoặc "click here"

**E. Tuân thủ Editorial**
- [ ] Không có forbidden language (xem danh sách FORBIDDEN bên dưới)
- [ ] Không có lời hứa hiệu suất hoặc cam kết lợi nhuận dù gián tiếp
- [ ] Business: 12 section đầy đủ và đúng thứ tự
- [ ] Risk section có Callout `type="danger"` với nội dung cụ thể
- [ ] Có section "Điều gì khiến luận điểm sai" (business) hoặc tương đương
- [ ] Disclaimer rõ ràng: nội dung là giáo dục, không phải khuyến nghị đầu tư

**F. Kỹ thuật**
- [ ] Build thành công: `npm run build`
- [ ] Không có TypeScript errors
- [ ] Render đúng cả light/dark mode
- [ ] Ảnh có alt text mô tả nội dung (không phải "image1.png")

### Step 6: Commit & Deploy

```bash
git add content/
git commit -m "Add: [content title]"
git push origin main
```

Vercel will automatically deploy your changes.

---

## Best Practices

### SEO Optimization

- Keep \description\ under 155 characters
- Use descriptive, keyword-rich titles
- Include relevant tags
- Add \updatedAt\ when refreshing old content

### Readability

- Use headings hierarchy (H2 → H3 → H4)
- Keep paragraphs short (3-5 sentences)
- Use bullet points for lists
- Break up long text with callouts
- Include whitespace for breathing room

### Citations

Always cite sources:

\\\markdown
- Revenue: 10 trillion VND [^1]
- Market share: 30% [^2]

[^1]: [Annual Report 2023](https://example.com)
[^2]: [Industry Report](https://example.com)
\\\

### Images

Store images in \public/images/\:

\\\jsx
<Image 
  src="/images/chart.png" 
  alt="Revenue growth chart 2020-2024"
  width={800}
  height={400}
/>
\\\

Always include descriptive alt text for accessibility.

### Research Review Schedule

Business research articles require an active review lifecycle:

| Trigger | Action |
|---|---|
| Quarterly earnings published | Update section 5 (Chất lượng tài chính) and section 12 (Ngày cập nhật nghiên cứu) |
| Major leadership change | Review section 4 (Ban lãnh đạo) and re-assess investment thesis |
| Significant M&A or strategy shift | Full re-review of all 12 sections |
| 12 months since last review | Add staleness warning callout at top of article |

**Staleness warning template** — add this Callout at the top of any article not reviewed in 12+ months:

```jsx
<Callout type="warning" title="Nội dung cần cập nhật">
  Bài phân tích này chưa được rà soát kể từ [DD/MM/YYYY]. Các số liệu tài chính và nhận định có thể đã lỗi thời. Vui lòng đọc báo cáo mới nhất của doanh nghiệp trước khi tham khảo.
</Callout>
```

### Privacy and Data Disclosure

When writing about the advisory/booking service or any data-collection feature, include accurate disclosures:

- **Booking form data** (name, email, phone, date, message): used only to schedule and confirm the session. Not shared with third parties or used for marketing.
- **Reader notes/highlights**: stored in browser `localStorage` only. No data sent to server.
- **No portfolio or transaction data** is ever collected by the platform.

Any content that describes product features must accurately reflect actual capability — do not describe features as working if they are not yet implemented.

---

## Further Reading

- [Component API Documentation](./COMPONENT-API.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Routes Documentation](./API-ROUTES.md)
