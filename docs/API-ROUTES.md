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

`GET|POST /api/internal/booking-email-worker` yêu cầu `Authorization: Bearer <CRON_SECRET>` ở production. Worker claim tối đa 25 job bằng `FOR UPDATE SKIP LOCKED`, retry exponential backoff và chuyển `dead` khi hết attempts. `vercel.json` gọi route mỗi 5 phút.

## Các route khác

- `POST /api/subscribe`: email subscription qua Resend.
- `GET /api/search?q=keyword`: tìm kiếm content MDX.

## Mã trạng thái chính

| Status | Ý nghĩa |
|---|---|
| `400` | Input/CAPTCHA không hợp lệ |
| `401` | Chưa có admin session |
| `403` | Action token sai, hết hạn hoặc đã dùng |
| `409` | Slot/state conflict |
| `429` | Vượt rate limit |
| `503` | Database/cấu hình tạm thời không sẵn sàng |

Action token là opaque random secret; database chỉ lưu hash, purpose, expiry và `consumed_at`. GET chỉ preview; mutation dùng POST. Raw provider error không được trả cho client.

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
```

`BOOKING_CAPTCHA_DISABLED=true` chỉ hoạt động ngoài production. `BOOKING_MEETING_LOCATION` là override tĩnh tùy chọn; nếu để trống hệ thống tạo Jitsi room riêng khi booking được xác nhận.

Chạy mọi migration trong [`database/migrations/`](../database/migrations/) theo thứ tự trước khi deploy code. Checklist chi tiết ở [`DEPLOYMENT.md`](./DEPLOYMENT.md).
