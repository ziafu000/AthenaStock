# AthenaStock Database

Hệ thống database dùng PostgreSQL chuẩn, tương thích Neon, Supabase, Vercel Postgres hoặc PostgreSQL tự quản lý.

## Khởi tạo

1. Tạo database và lấy `DATABASE_URL`.
2. Chạy `npm run migrate` để tự động áp dụng các migration chưa chạy và lưu vào `public.schema_migrations` (hoặc chạy thủ công các file trong `database/migrations/` theo thứ tự).
3. Điền các biến được liệt kê trong `docs/DEPLOYMENT.md` vào `.env.local` khi chạy local và Environment Variables khi deploy.

Migration có thể chạy lại an toàn nhờ `public.schema_migrations`. Không chỉnh sửa migration đã áp dụng; tạo file migration mới cho thay đổi schema tiếp theo.

## Supabase + Vercel

- App/Vercel dùng URI **Transaction Pooler** (port `6543`) và `sslmode=require`. Driver đã tắt prepared statements để tương thích transaction mode.
- Không đặt `anon key`, `service_role key` hoặc database credential trong biến `NEXT_PUBLIC_*`.
- Migration `002` và các migration thành viên bật RLS nhưng không tạo public policy, vì bảng chứa thông tin cá nhân. Chỉ server kết nối bằng `DATABASE_URL` được truy cập.
- DBeaver nên dùng **Session Pooler** (port `5432`) hoặc Direct connection nếu mạng hỗ trợ IPv6; bật SSL mode `require`.

## Trạng thái chính

### Booking
- `pending`: yêu cầu mới, chờ quản trị viên duyệt; nhiều khách hàng có thể cùng yêu cầu một khung giờ.
- `confirmed`: lịch đã được xác nhận và giữ slot.
- `reschedule_requested`: admin đã gửi đề xuất đổi lịch; slot cũ vẫn được giữ tới khi khách chọn lịch mới hoặc booking bị hủy.
- `cancelled`: booking đã hủy nhưng record/audit vẫn được giữ.

### VIP Payment Requests
- `pending`: yêu cầu thanh toán mới, chờ admin duyệt.
- `approved`: yêu cầu đã duyệt thành công, thời hạn VIP được kích hoạt/gia hạn.
- `rejected`: yêu cầu thanh toán bị từ chối.
- `more_info_needed`: admin yêu cầu bổ sung thông tin hoặc ảnh bill hợp lệ.

### Member Tier & Features
- Tier: `normal` (mặc định) và `vip` (có quyền truy cập sớm bài nghiên cứu trong 8h và quản lý danh mục VIP).
- Trạng thái Watchlist: `Đang theo dõi`, `Chờ thêm dữ liệu`, `Đang cập nhật`, `Đã hoàn tất nghiên cứu`, `Tạm dừng theo dõi`.

Các cột trạng thái email cho biết email đã gửi thành công hay cần retry; trạng thái booking và trạng thái email được theo dõi độc lập để không xác nhận trùng slot khi provider email lỗi.

## Schema hiện tại

Không sửa migration đã áp dụng. Các migration additive theo thứ tự:

| Migration | Nội dung |
|---|---|
| `004_booking_actions_and_audit.sql` | Thêm cancellation/audit/meeting fields và bảng `booking_actions` cho token expiring, single-purpose, one-time-use |
| `005_booking_email_jobs.sql` | Thêm `booking_email_jobs`, unique idempotency key, retry/dead-letter fields và claim indexes |
| `006_booking_rate_limits.sql` | Thêm counter theo time window với identifier đã HMAC/hash; không lưu raw IP |
| `007_reserve_reschedule_slots.sql` | Giữ unique slot cho cả `confirmed` và `reschedule_requested` để không mất lịch cũ trong lúc đổi lịch |
| `008_newsletter_subscriptions.sql` | Lưu consent/trạng thái subscription, token unsubscribe dạng hash và dùng chung email outbox |
| `009_create_members.sql` | Bảng `members` (id, email, full_name, phone, tier, vip_started_at, vip_expires_at) và unique lower(email) |
| `010_create_vip_payment_requests.sql` | Bảng `vip_payment_requests` (member_id, package_id, package_months, amount, transfer_code, bank_info, status, proof_image_data, notes) |
| `011_create_watchlists.sql` | Bảng `watchlists` (member_id, ticker, status, notes) với unique `(member_id, upper(ticker))` |
| `012_create_portfolios.sql` | Bảng `portfolio_holdings` (member_id, ticker, shares, cost_basis, notes) với unique `(member_id, upper(ticker))` |
| `013_create_audit_logs.sql` | Bảng `membership_audit_logs` (actor_type, actor_id, action, target_type, target_id, details jsonb) ghi nhận audit trail |

Data rules:

- `confirmed` và `reschedule_requested` giữ slot; `pending` không giữ slot.
- Availability đọc cả hai trạng thái giữ slot; mọi mutation vẫn kiểm tra lại dưới transaction/unique index.
- Cancel là state transition có audit, không phải delete.
- Action row lưu purpose, booking, expiry và `consumed_at`; consume phải atomic với mutation.
- Email job được insert cùng transaction với business state. Worker claim bằng `FOR UPDATE SKIP LOCKED`; `idempotency_key` unique theo event/recipient.
- Meeting URL được persist một lần khi confirmed và không regenerate khi email retry.
- VIP approval kiểm tra trạng thái và cập nhật thời hạn `vip_expires_at` nguyên tử trong transaction kèm ghi nhận audit log.
- Watchlist và Portfolio holdings deduplicate theo `(member_id, upper(ticker))`.
- RLS tiếp tục bật cho tất cả các bảng; chỉ server `DATABASE_URL` truy cập trực tiếp.
