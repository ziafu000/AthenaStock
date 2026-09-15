# Thông tin cần chuẩn bị để đưa cho AI làm

Điền vào file này trước khi bắt session mới. Không cần điền hết — AI sẽ làm được phần nào có đủ thông tin.

---

## A. About page — Methodology section

Cần bạn xác nhận để AI viết đúng thực tế, không phỏng đoán:

**1. Quy trình nghiên cứu doanh nghiệp**
- Nguồn dữ liệu chính bạn dùng là gì? (VD: BCTC từ vietstock/cafef/trang IR, báo cáo thường niên, NDSR, Bloomberg...)
- Thứ tự phân tích: bắt đầu từ đâu? (VD: đọc mô hình kinh doanh trước, hay xem tài chính trước?)
- Có cross-check với nguồn thứ cấp không? (VD: báo chí, đối thủ cạnh tranh, khách hàng doanh nghiệp...)

**2. Cách phân biệt fact / inference / assumption**
- Quy trình hiện tại là gì? (Đã dùng nhãn "Dữ kiện / Nhận định / Giả định" trong bài FPT — muốn mô tả thêm gì?)

**3. Quy trình update và sửa sai**
- Khi phát hiện sai sót trong bài đã publish, quy trình xử lý là gì?
- Có ghi chú correction ở đầu bài không, hay edit thầm?

**4. Đội ngũ**
- Có mấy người tham gia? Vai trò là gì? (VD: tác giả chính, researcher, editor...)
- Có muốn nêu tên không, hay ẩn danh?
- Ai trong team hiện có/không có vị thế trong các doanh nghiệp được phân tích?

---

## B. Trang `/privacy`

Xác nhận các điểm sau để AI viết chính xác:

**Data thu thập:**
- [ ] Booking form: tên, email, số điện thoại, ngày hẹn, lời nhắn → lưu ở đâu? (VD: Google Sheet, Notion, email tới admin...)
- [ ] Email newsletter: có không? Dùng tool gì? (VD: Mailchimp, Brevo, Buttondown...)
- [ ] Analytics: dùng Vercel Analytics (đã thấy trong code) — có thêm GA, Hotjar, hay tool nào khác không?
- [ ] Reader notes/highlights: localStorage only (đã confirm trong code — không gửi lên server)

**Bên thứ ba nhận data:**
- Vercel (hosting + analytics) — xác nhận
- Cloudflare Turnstile (captcha trong booking form) — xác nhận
- Email provider gửi booking confirmation là gì? (VD: Resend, SendGrid, Nodemailer + SMTP...)
- Có bên nào khác không?

**Thời gian lưu data:**
- Booking requests lưu bao lâu?
- Có quy trình xóa data không?

---

## C. Bài business research mới

Mỗi bài cần bạn cung cấp:

**Chọn doanh nghiệp:**
```
Tên: _______________
Ticker: _______________
Sàn: HOSE / HNX / UPCOM
Lý do chọn (1–2 câu): _______________
```

**Nguồn dữ liệu bạn sẽ dùng:**
```
Báo cáo thường niên năm: _______________
URL trang IR: _______________
Các nguồn khác: _______________
```

**Số liệu tài chính chính (từ BCTC gần nhất):**
```
Doanh thu: _______________
Lợi nhuận ròng: _______________
Biên lợi nhuận ròng: _______________
ROE: _______________
Tăng trưởng doanh thu YoY: _______________
Nợ vay / EBITDA: _______________
Dòng tiền tự do (FCF): _______________
```

**Bạn đánh giá sơ bộ:**
```
Moat chính là gì? _______________
Rủi ro lớn nhất? _______________
Điều gì có thể khiến luận điểm sai? _______________
Bạn có đang nắm giữ cổ phiếu này không? (cần disclosure) _______________
```

Sau khi điền, AI sẽ viết đủ 12 section theo schema chuẩn.

---

## D. Update bài FPT (nếu muốn refresh data)

Cần số liệu từ BCTC Q1/Q2 2025 (hoặc BCTC năm 2024):

```
Nguồn: https://fpt.com.vn/en/investor-relations
Doanh thu công nghệ nước ngoài Q1/Q2 2025: _______________
Tăng trưởng YoY: _______________
Biên lợi nhuận: _______________
Dòng tiền tự do: _______________
Thị trường Nhật/Mỹ/EU: _______________
Cập nhật nào đáng chú ý về chiến lược AI/automotive: _______________
```
