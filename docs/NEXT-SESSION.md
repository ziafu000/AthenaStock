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

### 5. Bài psychology mới — AI làm hoàn toàn
- Confirmation Bias (có citations học thuật)
- Loss Aversion & Prospect Theory (Kahneman & Tversky 1979)
- Anchoring Bias trong định giá

### 6. Bài framework mới — AI làm hoàn toàn
- Owner Earnings (Buffett definition vs. GAAP earnings)
- Mental model: DCF sensitivity — tại sao terminal value chiếm phần lớn

### 7. Bài business research mới (cần input từ bạn)
**Bạn cần chuẩn bị → xem file `docs/INFO-NEEDED.md`**

### 8. Hoàn thiện Library Glossary (AI làm, bạn review)
~20 thuật ngữ: P/E, P/B, ROE, ROIC, FCF, Moat, Margin of Safety, Owner Earnings, WACC, Terminal Value, Earnings Yield, Net Margin, Operating Leverage, Capex, Working Capital, Goodwill, Float, Book Value, Intrinsic Value, Circle of Competence.

---

## Khi bắt đầu session mới, nói với AI:

> "Đọc `docs/NEXT-SESSION.md` và `docs/INFO-NEEDED.md`, sau đó tiếp tục theo thứ tự ưu tiên."
