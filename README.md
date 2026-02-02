# Đầu tư tỉnh thức – Mindful Investing

Website giúp nhà đầu tư cá nhân hiểu đúng bản chất doanh nghiệp và làm chủ tâm lý hành vi để đầu tư bền vững.

## 🎯 Triết lý

- **Không khuyến nghị mua/bán** – Chúng tôi phân tích, không chỉ đạo
- **Trình bày cả rủi ro** – Mọi phân tích đều có phần "Risks & What could prove me wrong"
- **Typography-first UX** – Thiết kế tập trung vào trải nghiệm đọc
- **Calm design** – Không pop-up, không countdown, không CTA áp lực

## 🚀 Bắt đầu

### Yêu cầu
- Node.js 18+ 
- npm hoặc pnpm

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd mindful-investing

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

### Build production

```bash
npm run build
npm run start
```

## 📁 Cấu trúc thư mục

```
mindful-investing/
├── content/                    # Nội dung MDX
│   ├── article/               # Bài viết về triết lý đầu tư
│   ├── business/              # Phân tích doanh nghiệp
│   ├── psychology/            # Tâm lý hành vi
│   └── framework/             # Frameworks & checklists
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   │   ├── layout/            # Header, Footer
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── article/           # Article layouts & components
│   │   │   ├── ArticleLayout.tsx
│   │   │   ├── BusinessAnalysisLayout.tsx
│   │   │   └── ReadingProgress.tsx
│   │   ├── reading/           # Reading controls
│   │   │   ├── ReadingContext.tsx
│   │   │   └── ReadingControls.tsx
│   │   ├── ui/                # UI components
│   │   │   └── ModeToggle.tsx
│   │   ├── callout-box.tsx
│   │   ├── mdx-components.tsx
│   │   ├── mdx-content.tsx
│   │   └── post-card.tsx
│   └── lib/                   # Utilities
│       ├── mdx.ts             # MDX processing
│       └── content-types.ts   # TypeScript types
└── public/                    # Static assets
```

## 📝 Thêm bài viết mới

### Cấu trúc Frontmatter

```yaml
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn gọn (155 ký tự tối đa cho SEO)"
date: "2024-01-15"
updatedAt: "2024-01-20"              # Optional
type: "article"                      # article | business | psychology | framework
tags: ["philosophy", "buffett"]
readingTime: "5 min"
series: "Nền tảng Đầu tư"           # Optional
---
```

### Các loại nội dung (Content Types)

| Type | Thư mục | Route | Mô tả |
|------|---------|-------|-------|
| `article` | `content/article/` | `/articles/[slug]` | Bài viết về triết lý đầu tư |
| `business` | `content/business/` | `/business/[slug]` | Phân tích doanh nghiệp |
| `psychology` | `content/psychology/` | `/psychology/[slug]` | Tâm lý hành vi |
| `framework` | `content/framework/` | `/frameworks/[slug]` | Frameworks & checklists |

### Frontmatter cho Business Analysis

```yaml
---
title: "Tên công ty: Tiêu đề phân tích"
description: "Mô tả ngắn về phân tích"
date: "2024-01-15"
updatedAt: "2024-01-20"
type: "business"
tags: ["tech", "bluechip"]
tickers: ["FPT"]                     # Mã cổ phiếu
market: "HOSE"                       # Sàn giao dịch
riskLevel: "medium"                  # low | medium | high
readingTime: "15 min"
citations:
  - label: "Báo cáo thường niên 2023"
    url: "https://..."
  - label: "Nguồn khác"
    url: "https://..."
---
```

### Template Business Analysis (10 phần bắt buộc)

```markdown
## 1. Summary
- Bullet 1: Mô hình kinh doanh
- Bullet 2: Vị thế cạnh tranh
- Bullet 3: Tình hình tài chính

## 2. Thesis (Luận điểm đầu tư)
Tại sao doanh nghiệp này đáng quan tâm...

## 3. Evidence & Citations
Dữ kiện + nguồn trích dẫn...

## 4. Moat (Lợi thế cạnh tranh)
- Chi phí chuyển đổi
- Hiệu ứng mạng lưới
- ...

## 5. Management & Capital Allocation
Đánh giá ban lãnh đạo...

## 6. Key Drivers
Động lực tăng trưởng...

## 7. Risks & What could prove me wrong
<Callout type="danger" title="Rủi ro trọng yếu">
  **Rủi ro 1:** ...
  **Rủi ro 2:** ...
</Callout>

**What could prove me wrong?**
- Điều gì có thể chứng minh luận điểm sai...

## 8. Assumptions (Giả định)
- Giả định 1
- Giả định 2

## 9. Valuation (Định giá tham khảo)
Không đưa target giá, chỉ đưa biện độ và giải thích giả định...

## 10. Conclusion: Sleep-well Test
Nếu nắm giữ 5 năm không nhìn thị trường, có lo lắng không?
```

## 🧩 Components MDX

### Callout

```jsx
<Callout type="info" title="Tiêu đề">
  Nội dung callout...
</Callout>
```

Các type:
- `default` – Note thông thường (màu xám)
- `info` – Thông tin (màu xanh dương)
- `warning` – Cảnh báo (màu vàng)
- `danger` – Nguy hiểm/rủi ro (màu đỏ)

## 🎨 Tính năng UX

### Focus Mode
Bật/tắt bằng nút mắt ở góc phải dưới. Khi bật:
- Ẩn header
- Giảm nhiễu UI
- Tập trung vào nội dung

### Font Size Control
A↓/A↑ để điều chỉnh cỡ chữ (lưu vào localStorage).

### Line Width Control  
Điều chỉnh độ rộng dòng: Normal / Wide.

### Reading Progress
Thanh tiến trình đọc mảnh ở trên cùng trang.

## 🚫 Quy tắc viết bài (TONE)

### CẤM tuyệt đối:
- ❌ "Mua ngay", "target X đồng", "kèo thơm"
- ❌ "Vào lệnh", "đánh theo", "canh đáy"  
- ❌ Cam kết lợi nhuận, % lãi
- ❌ Ngôn ngữ kích thích FOMO
- ❌ Đồng hồ đếm ngược, CTA áp lực
- ❌ Màu đỏ xanh chói kiểu bảng giá

### NÊN:
- ✅ Ngôn ngữ điềm tĩnh, thẳng thắn
- ✅ Trình bày cả mặt tốt và rủi ro
- ✅ Có trích nguồn cho mọi dữ kiện
- ✅ Nêu rõ giả định trong định giá
- ✅ Phần "What could prove me wrong" luôn có
- ✅ Khuyến khích đọc chậm, suy ngẫm

## 🚀 Deploy lên Vercel

1. Push code lên GitHub
2. Import project trên [Vercel](https://vercel.com)
3. Chọn "Next.js" Framework preset
4. Deploy!

Hoặc dùng Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 📋 QA Checklist

Trước khi publish bài mới, kiểm tra:

- [ ] Không có ngôn ngữ "kèo/đánh/vào lệnh"
- [ ] Không có CTA tạo áp lực
- [ ] Business analysis có phần Risks
- [ ] Business analysis có "What could prove me wrong"
- [ ] Tất cả dữ kiện có citations
- [ ] Frontmatter đầy đủ và chính xác
- [ ] Build thành công (`npm run build`)

## 🛠 Tech Stack

- [Next.js 14](https://nextjs.org/) – App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + Typography plugin
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) – MDX processing
- [next-themes](https://github.com/pacocoursey/next-themes) – Dark mode
- [Lucide React](https://lucide.dev/) – Icons

## 📄 License

MIT

---

*"The stock market is a device for transferring money from the impatient to the patient."* – Warren Buffett
"# AthenaStock" 
