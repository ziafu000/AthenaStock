# Booking database

Hệ thống booking dùng PostgreSQL chuẩn, tương thích Neon, Supabase, Vercel Postgres hoặc PostgreSQL tự quản lý.

## Khởi tạo

1. Tạo database và lấy `DATABASE_URL`.
2. Chạy lần lượt mọi file trong `database/migrations/` theo thứ tự tên bằng SQL editor của nhà cung cấp hoặc `psql`.
3. Điền các biến được liệt kê trong `docs/DEPLOYMENT.md` vào `.env.local` khi chạy local và Environment Variables khi deploy.

Migration có thể chạy lại an toàn. Không chỉnh sửa migration đã áp dụng; tạo file migration mới cho thay đổi schema tiếp theo.

## Supabase + Vercel

- App/Vercel dùng URI **Transaction Pooler** (port `6543`) và `sslmode=require`. Driver đã tắt prepared statements để tương thích transaction mode.
- Không đặt `anon key`, `service_role key` hoặc database credential trong biến `NEXT_PUBLIC_*`.
- Migration `002` bật RLS nhưng không tạo public policy, vì bảng chứa thông tin cá nhân của khách. Chỉ server kết nối bằng `DATABASE_URL` được truy cập.
- DBeaver nên dùng **Session Pooler** (port `5432`) hoặc Direct connection nếu mạng hỗ trợ IPv6; bật SSL mode `require`.

## Trạng thái chính

- `pending`: yêu cầu mới, chờ quản trị viên duyệt; nhiều khách hàng có thể cùng yêu cầu một khung giờ.
- `confirmed`: lịch đã được xác nhận và giữ slot.
- `reschedule_requested`: admin đã gửi đề xuất đổi lịch; slot cũ vẫn được giữ tới khi khách chọn lịch mới hoặc booking bị hủy.
- `cancelled`: booking đã hủy nhưng record/audit vẫn được giữ.

Các cột trạng thái email cho biết email đã gửi thành công hay cần retry; trạng thái booking và trạng thái email được theo dõi độc lập để không xác nhận trùng slot khi provider email lỗi.

## Schema booking hiện tại

Không sửa migration đã áp dụng. Workflow hoàn chỉnh dùng bốn migration additive sau `001`-`003`:

| Migration | Nội dung |
|---|---|
| `004_booking_actions_and_audit.sql` | Thêm cancellation/audit/meeting fields và bảng `booking_actions` cho token expiring, single-purpose, one-time-use |
| `005_booking_email_jobs.sql` | Thêm `booking_email_jobs`, unique idempotency key, retry/dead-letter fields và claim indexes |
| `006_booking_rate_limits.sql` | Thêm counter theo time window với identifier đã HMAC/hash; không lưu raw IP |
| `007_reserve_reschedule_slots.sql` | Giữ unique slot cho cả `confirmed` và `reschedule_requested` để không mất lịch cũ trong lúc đổi lịch |

Data rules:

- `confirmed` và `reschedule_requested` giữ slot; `pending` không giữ slot.
- Availability đọc cả hai trạng thái giữ slot; mọi mutation vẫn kiểm tra lại dưới transaction/unique index.
- Cancel là state transition có audit, không phải delete.
- Action row lưu purpose, booking, expiry và `consumed_at`; consume phải atomic với mutation.
- Email job được insert cùng transaction với business state. Worker claim bằng `FOR UPDATE SKIP LOCKED`; `idempotency_key` unique theo event/recipient.
- Meeting URL được persist một lần khi confirmed và không regenerate khi email retry.
- RLS tiếp tục bật, không có policy cho `anon`/`authenticated`; chỉ server `DATABASE_URL` truy cập booking tables.
