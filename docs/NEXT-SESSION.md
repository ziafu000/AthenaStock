# Next Session — Athena Stock

> Đọc file này đầu mỗi session mới. Cập nhật khi hoàn thành từng việc.

## Trạng thái hiện tại (sau commit f4a6234)

Đã hoàn thành P0 → P3 của initiative "Investment Thinking House":
- Brand copy đồng bộ toàn site (North Star: "Đầu tư như một người chủ doanh nghiệp")
- 4 bài MDX có internal links, citations cụ thể, không còn khẳng định tuyệt đối
- CONTENT-GUIDE có 22-point pre-publish checklist
- PRODUCT-DIRECTION có Editorial Methodology section
- Disclaimer, Footer, Advisory, SearchBubble, BookingModal — không còn mâu thuẫn

Điểm phù hợp ước tính: **~72% / 100%** (từ 55% ban đầu).

---

## Việc tiếp theo — theo thứ tự ưu tiên

### 1. Sync metadata hub pages (AI làm ngay, không cần input)
File cần sửa — vẫn còn "góc nhìn cá nhân" / "tỉnh thức" trong metadata:
- `src/app/articles/page.tsx`
- `src/app/business/page.tsx`
- `src/app/psychology/page.tsx`
- `src/app/frameworks/page.tsx`

### 2. FPT staleness warning (AI làm ngay, không cần input)
Thêm Callout warning vào đầu `content/business/fpt-corporation.mdx` vì data dừng Q2 2024.

### 3. About page — methodology section (cần input từ bạn)
**Bạn cần chuẩn bị → xem file `docs/INFO-NEEDED.md`**

### 4. Trang `/privacy` (cần input từ bạn)
**Bạn cần chuẩn bị → xem file `docs/INFO-NEEDED.md`**

### 5. Bài psychology mới — [Đã hoàn thành]
- Confirmation Bias (`content/psychology/confirmation-bias.mdx`) — có citations Wason (1960), Lord, Ross & Lepper (1979)
- Loss Aversion & Prospect Theory (`content/psychology/loss-aversion.mdx`) — Kahneman & Tversky (1979), Shefrin & Statman (1985), Odean (1998)
- Anchoring Bias trong định giá (`content/psychology/anchoring-bias.mdx`) — Tversky & Kahneman (1974)

### 6. Bài framework mới — [Đã hoàn thành]
- Owner Earnings (`content/framework/owner-earnings.mdx`) — Buffett definition 1986 vs. GAAP earnings, Maintenance vs Growth Capex
- Mental model: DCF sensitivity (`content/framework/dcf-sensitivity.mdx`) — tại sao terminal value chiếm 60-80%+, WACC sensitivity, Reverse DCF

### 7. Bài business research mới (cần input từ bạn)
**Bạn cần chuẩn bị → xem file `docs/INFO-NEEDED.md`**

### 8. Hoàn thiện Library Glossary — [Đã hoàn thành]
20 thuật ngữ cốt lõi tại `src/app/library/glossary/page.tsx`, search & category filter, công thức và góc nhìn đầu tư: P/E, P/B, ROE, ROIC, FCF, Moat, Margin of Safety, Owner Earnings, WACC, Terminal Value, Earnings Yield, Net Margin, Operating Leverage, Capex, Working Capital, Goodwill, Float, Book Value, Intrinsic Value, Circle of Competence.
`src/app/library/page.tsx` đã kích hoạt `comingSoon: false`.

---

## Khi bắt đầu session mới, nói với AI:

> "Đọc `docs/NEXT-SESSION.md` và `docs/INFO-NEEDED.md`, sau đó tiếp tục theo thứ tự ưu tiên."
