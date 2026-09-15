# API Routes

Booking dùng PostgreSQL làm source of truth, Resend qua durable outbox và file lịch `.ics`. UI công khai hiện tại được giữ nguyên, chỉ bổ sung trạng thái availability/CAPTCHA cần thiết.

## Public booking

### `GET /api/booking/availability?date=YYYY-MM-DD`

Trả dữ liệu an toàn, không chứa thông tin khách hàng:

```json
{
  "date": "2026-08-20",
  "timeBlocks": ["09:00 - 10:00 (Sáng)"],
  "unavailable": ["09:00 - 10:00 (Sáng)"]
}
```

Ngày phải từ ngày mai theo `Asia/Ho_Chi_Minh`. Slot của booking `confirmed` hoặc `reschedule_requested` là unavailable; `pending` không giữ chỗ. Response luôn `no-store`.

### `POST /api/booking`

```json
{
  "name": "Nguyen Van A",
  "email": "email@example.com",
  "phone": "0123456789",
  "date": "2026-08-20",
  "timeBlock": "14:00 - 15:00 (Chiều)",
  "message": "Nội dung cần trao đổi",
  "captchaToken": "turnstile-token"
}
```

Production bắt buộc Turnstile. Route rate-limit theo IP và email, recheck slot trong transaction, rồi atomically lưu booking `pending`, action admin và email job. Thành công trả `201`; request trùng cùng email/slot trả bản ghi cũ với `200` và `duplicate: true`. Request không chờ Resend.

## Admin booking actions

### `GET|POST /api/booking/confirm`

- `GET ?token=...`: preview HTML, không đổi state.
- `POST`: nhận token qua form hoặc JSON, atomically xác nhận slot, tạo/persist meeting URL, consume action và enqueue email khách kèm `.ics`.

### `GET|POST /api/booking/reschedule`

- `GET ?token=...`: trả thông tin tối thiểu cho trang quản trị đề xuất lịch mới.
- `POST`: nhận `{ "token": "...", "suggestions": [{ "date": "...", "timeBlock": "..." }] }`, giữ slot cũ bằng trạng thái `reschedule_requested` và enqueue email customer action.

## Customer self-service

### `GET|POST /api/booking/respond`

- `GET ?token=...`: trả booking, suggestions và các slot đang unavailable.
- `POST`: nhận `{ "token": "...", "date": "...", "timeBlock": "..." }`; lựa chọn phải thuộc suggestions. Transaction recheck slot, chuyển booking về `confirmed`, consume token và enqueue email/ICS. Conflict trả `409` và token vẫn dùng được cho lựa chọn khác.

### `GET|POST /api/booking/cancel`

- `GET ?token=...`: preview tối thiểu, `no-store`.
- `POST`: nhận `{ "token": "...", "reason": "..." }`, cancel có audit và consume token. Booking đã xác nhận nhận `.ics` `METHOD:CANCEL`; record không bị xóa.

## Admin dashboard

- `POST /api/admin/auth/request`: nhận `{ "email": "..." }`, rate-limit và luôn trả thông báo chung; chỉ `ADMIN_EMAIL` được enqueue magic link.
- `GET /api/admin/auth/verify?token=...`: preview form đăng nhập, không consume token.
- `POST /api/admin/auth/verify`: consume token một lần và tạo cookie HttpOnly, Secure, SameSite=Lax.
- `GET|DELETE /api/admin/session`: kiểm tra hoặc xóa session.
- `GET /api/admin/bookings?status=...`: danh sách tối đa 100 booking, yêu cầu admin session.
- `POST /api/admin/bookings/:id/cancel`: admin cancel với `{ "reason": "..." }`.
- UI vận hành: `/admin/bookings`.

## Email worker

`GET|POST /api/internal/booking-email-worker` yêu cầu `Authorization: Bearer <CRON_SECRET>` ở production. Worker claim tối đa 25 job bằng `FOR UPDATE SKIP LOCKED`, retry exponential backoff và chuyển `dead` khi hết attempts. Mỗi thao tác booking đều kích hoạt worker ngay sau response; `vercel.json` chạy thêm một lần/ngày (`02:00 UTC`, thời gian thực tế có thể lệch trong một giờ trên Vercel Hobby) làm fallback cho job lỗi.

## Subscription và search

- `POST /api/subscribe`: validate email, rate-limit theo IP/email, persist consent trong PostgreSQL và enqueue email chào mừng/admin notification. Subscriber đang active trả `200` và không tạo email trùng; subscriber mới hoặc được kích hoạt lại trả `201`.
- `GET /api/subscribe/unsubscribe?token=...`: preview form, không đổi state.
- `POST /api/subscribe/unsubscribe`: consume token một lần và chuyển subscription sang `unsubscribed`.
- `GET /api/search?q=keyword`: query tối đa 80 ký tự, trả tối đa 20 kết quả với metadata tối thiểu; có shared rate limit và CDN cache.

## Member authentication & profile

Session hội viên sử dụng cookie HttpOnly `athena_member_session` được ký HMAC SHA-256.

### `POST /api/member/auth`

- `action: "request_otp"`: nhận `{ "email": "...", "full_name": "...", "phone": "..." }`. Tạo hoặc cập nhật thông tin cơ bản của member, tạo mã OTP 6 số và gửi qua email/log.
- `action: "verify_otp"`: nhận `{ "email": "...", "code": "..." }`. Xác thực OTP, tạo session cookie thời hạn 30 ngày và trả thông tin `member`.
- `action: "logout"`: xóa session cookie.
- `action: "status"`: kiểm tra session hiện tại, trả `{ "authenticated": true|false, "member": ... }`.

### `GET /api/member/payment-requests`

Yêu cầu session hội viên. Trả danh sách lịch sử yêu cầu nâng cấp VIP của thành viên (lược bỏ `proof_image_data` để tối ưu payload).

## Personal Watchlist & VIP Portfolio

### `GET|POST|DELETE /api/member/watchlist`

Yêu cầu session hội viên:
- `GET`: trả danh sách mã cổ phiếu đang theo dõi kèm trạng thái và ghi chú.
- `POST`: nhận `{ "ticker": "...", "status": "...", "notes": "..." }`. Upsert theo `(member_id, (upper(ticker)))`.
- `DELETE ?ticker=...`: xóa mã khỏi watchlist.

### `GET|POST|DELETE /api/member/portfolio`

Yêu cầu session hội viên với hạng `vip` còn hiệu lực (trả `403` với `code: "VIP_REQUIRED"` nếu không phải VIP):
- `GET`: trả danh mục nắm giữ kèm giá tham chiếu thị trường, tổng giá trị, giá vốn, lãi/lỗ và tỷ trọng phân bổ danh mục.
- `POST`: nhận `{ "ticker": "...", "shares": 1000, "cost_basis": 25000, "notes": "..." }`. Upsert theo `(member_id, (upper(ticker)))`.
- `DELETE ?ticker=...`: xóa cổ phiếu khỏi danh mục.

## VIP Upgrade & Payment

### `POST /api/vip/create-request`

Nhận `{ "email": "...", "full_name": "...", "phone": "...", "package_id": "vip_1m" | "vip_3m" | "vip_6m" | "vip_12m" }`.
- Nếu email đã đăng ký tài khoản, yêu cầu caller phải đăng nhập phiên hợp lệ (tránh mạo danh tài khoản).
- Sinh mã chuyển khoản chuẩn dạng `ATHENA DK V03 R7K2`.
- Trả thông tin tài khoản ngân hàng, mã chuyển khoản, số tiền và `upload_token` ký HMAC dùng để tải hóa đơn.

### `POST /api/vip/upload-proof`

Nhận `{ "requestId": "...", "uploadToken": "...", "proof_image_data": "data:image/jpeg;base64,..." }`.
- Xác thực `uploadToken` hoặc session của chính chủ sở hữu yêu cầu.
- Giới hạn kích thước ảnh tối đa 5MB, hỗ trợ định dạng JPEG, PNG, WebP.
- Cập nhật ảnh bill, nếu trạng thái trước đó là `more_info_needed` sẽ tự động chuyển về `pending` và ghi nhận audit log.
- Trả kết quả gọn (không serialize lại chuỗi ảnh base64 lớn).

## Admin VIP Management

Yêu cầu admin session (`/api/admin/session`).

### `GET /api/admin/vip/requests`

- `GET`: trả danh sách tối đa 200 yêu cầu nâng cấp VIP, sắp xếp mới nhất trước, lược bỏ `proof_image_data` để giảm tải băng thông.
- `GET ?id=...`: trả chi tiết một yêu cầu cụ thể kèm `proof_image_data` để admin xem ảnh bill chuyển khoản.

### `POST /api/admin/vip/approve`

Nhận `{ "requestId": "...", "overrideMonths": 3, "notes": "..." }`.
- Khóa bản ghi bằng `FOR UPDATE` trong database transaction để tránh race condition double-approval.
- Cập nhật hạng `vip`, tính toán `vip_expires_at` mới (nối tiếp thời hạn hiện tại nếu đang active hoặc tính từ thời điểm duyệt).
- Chuyển trạng thái yêu cầu sang `approved` và ghi nhận audit log vào `membership_audit_logs`.

### `POST /api/admin/vip/reject`

Nhận `{ "requestId": "...", "action": "reject" | "request_info", "notes": "..." }`.
- Chặn từ chối đối với yêu cầu đã được duyệt (`approved`).
- Chuyển trạng thái sang `rejected` hoặc `more_info_needed` và ghi nhận audit log.

## Mã trạng thái chính

| Status | Ý nghĩa |
|---|---|
| `400` | Input/CAPTCHA không hợp lệ |
| `401` | Chưa có admin session |
| `403` | Action token sai, hết hạn hoặc đã dùng |
| `409` | Slot/state conflict |
| `429` | Vượt rate limit |
| `503` | Database/cấu hình tạm thời không sẵn sàng |

Action token là opaque random secret; database chỉ lưu hash, purpose, expiry và `consumed_at`. Public GET chỉ preview; mutation dùng POST. Worker nội bộ là ngoại lệ có xác thực vì Vercel Cron gọi bằng GET. Raw provider error không được trả cho client.

## Biến môi trường

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=admin@example.com
SENDER_EMAIL=Athena Stock <booking@example.com>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BOOKING_SECRET=a-random-secret-at-least-32-characters
ADMIN_SESSION_SECRET=a-separate-random-secret-at-least-32-characters
CRON_SECRET=a-random-cron-secret-at-least-32-characters
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
BOOKING_CAPTCHA_DISABLED=false
BOOKING_ACTION_TTL_HOURS=72
BOOKING_MEETING_PROVIDER=jitsi
BOOKING_MEETING_URL_BASE=https://meet.jit.si
BOOKING_MEETING_LOCATION=
GLOBAL_VIP_OVERRIDE=false
VIP_BANK_NAME="MB Bank"
VIP_BANK_ID=MB
VIP_BANK_ACCOUNT_NUMBER=0901234567
VIP_BANK_ACCOUNT_NAME="ATHENA STOCK"
```

`BOOKING_CAPTCHA_DISABLED=true` chỉ hoạt động ngoài production. `BOOKING_MEETING_LOCATION` là override tĩnh tùy chọn; nếu để trống hệ thống tạo Jitsi room riêng khi booking được xác nhận. `GLOBAL_VIP_OVERRIDE=true` cho phép mở toàn bộ nội dung nghiên cứu VIP cho mọi người dùng khi cần kiểm thử hoặc chạy chiến dịch. Các biến `VIP_BANK_*` tùy chọn dùng để cấu hình tài khoản ngân hàng hiển thị trên trang thanh toán và sinh mã VietQR.

Chạy mọi migration trong [`database/migrations/`](../database/migrations/) theo thứ tự trước khi deploy code. Checklist chi tiết ở [`DEPLOYMENT.md`](./DEPLOYMENT.md).
