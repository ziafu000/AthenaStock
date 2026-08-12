# Deployment Guide

Release phải giữ nguyên frontend hiện tại và cấu hình đầy đủ PostgreSQL, Resend cùng token booking trước khi public form.

## Yêu cầu

- Node.js 20+
- Một PostgreSQL chuẩn như Neon, Supabase, Vercel Postgres hoặc self-hosted
- Tài khoản Resend và domain gửi email đã xác minh
- Vercel hoặc nền tảng chạy Next.js tương đương

## 1. Database

1. Tạo Supabase project và lấy URI **Transaction Pooler** (port `6543`) có `sslmode=require` cho app/Vercel.
2. Chạy lần lượt mọi file trong [`database/migrations/`](../database/migrations/) theo thứ tự tên (`001`, `002`, `003`, ...).
3. Xác nhận các bảng `bookings`, `booking_actions`, `booking_email_jobs`, `booking_rate_limits`, RLS và partial unique index `bookings_reserved_start_at_idx` đã có.

Với production đã chạy migration `001` cũ: deploy code tương thích trước, sau đó chạy `003_allow_competing_booking_requests.sql`. Migration này cho phép nhiều request `pending` cùng slot nhưng chỉ một request được `confirmed`.

Không cần Google Cloud Console hoặc thông tin thẻ tín dụng Google.

## 2. Resend

1. Xác minh domain trong Resend.
2. Tạo API key giới hạn cho môi trường tương ứng.
3. Đặt `SENDER_EMAIL` trên domain đã xác minh.

Sandbox của Resend chỉ gửi được tới địa chỉ được phép, vì vậy cần verify domain trước khi test production.

## 3. Environment variables

```bash
DATABASE_URL=postgresql://postgres.project-ref:password@region.pooler.supabase.com:6543/postgres?sslmode=require
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=admin@example.com
SENDER_EMAIL=Athena Stock <booking@example.com>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BOOKING_SECRET=a-random-secret-at-least-32-characters
ADMIN_SESSION_SECRET=a-separate-random-secret-at-least-32-characters
CRON_SECRET=a-random-cron-secret-at-least-32-characters
BOOKING_ACTION_TTL_HOURS=72
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
BOOKING_CAPTCHA_DISABLED=false
BOOKING_MEETING_PROVIDER=jitsi
BOOKING_MEETING_URL_BASE=https://meet.jit.si
BOOKING_MEETING_LOCATION=
```

- Sinh `BOOKING_SECRET` ngẫu nhiên, tối thiểu 32 ký tự; không dùng giá trị mẫu.
- `NEXT_PUBLIC_APP_URL` phải là origin production để link trong email đúng host.
- `ADMIN_SESSION_SECRET` phải tách khỏi `BOOKING_SECRET`; rotate secret này chỉ đăng xuất session admin.
- `CRON_SECRET` bảo vệ email worker; Vercel Cron tự gửi secret này qua Bearer header. Lịch fallback hiện là một lần/ngày để tương thích Vercel Hobby.
- Hai Turnstile key bắt buộc ở production. `BOOKING_CAPTCHA_DISABLED=true` chỉ dùng local.
- `BOOKING_MEETING_LOCATION` là override tùy chọn; để trống để tạo Jitsi room riêng.
- Dùng database và API key riêng cho preview/production.
- Không đưa database password hoặc Supabase service key vào biến `NEXT_PUBLIC_*`.

## 4. Deploy Vercel

1. Import repository vào Vercel.
2. Chọn preset Next.js, Node.js 20+.
3. Thêm toàn bộ environment variables cho đúng environment.
4. Deploy và chạy smoke test booking.

Các lệnh kiểm tra trước deploy:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

## Checklist sau deploy

- [ ] Migration đã chạy đúng database production
- [ ] RLS của bảng `bookings` đã bật và không có public policy
- [ ] Form booking tạo đúng một bản ghi
- [ ] Email admin nhận link confirm và reschedule
- [ ] Mở link confirm chưa làm thay đổi dữ liệu; submit confirm mới gửi email
- [ ] Email khách có file `.ics` import được vào ứng dụng lịch
- [ ] Reload/replay không gửi trùng email
- [ ] Token sai và token hết hạn bị từ chối
- [ ] Slot trùng trả lỗi rõ ràng
- [ ] Slot đã giữ bị disable trước submit; server vẫn trả `409` khi có race
- [ ] `/admin/bookings` chỉ mở sau magic-link POST confirmation
- [ ] Customer reschedule/cancel dùng được và token không replay được
- [ ] Email được xử lý ngay sau action; Cron hằng ngày xử lý tiếp job `pending/retry -> sent` hoặc `dead`
- [ ] Production từ chối booking thiếu/sai Turnstile token
- [ ] Domain gửi Resend đã verified
- [ ] Sitemap, robots, analytics và toàn bộ route hiện tại hoạt động
- [ ] Frontend không có thay đổi hình ảnh ngoài copy booking bắt buộc

## Rollback và xoay secret

- Nếu email lỗi, giữ database và tắt/ẩn điểm vào booking ở tầng vận hành; không xóa bản ghi để còn audit/retry.
- Rollback code không được rollback/xóa migration đã áp dụng.
- Đổi `BOOKING_SECRET` sẽ vô hiệu toàn bộ link cũ; gửi lại link mới nếu cần.
- Thu hồi ngay Resend key hoặc database credential bị lộ và cập nhật environment variables.

## Troubleshooting

### Booking trả `503`

Kiểm tra `DATABASE_URL`, migration, `RESEND_API_KEY`, `SENDER_EMAIL`, `ADMIN_EMAIL`, `BOOKING_SECRET` và function logs.

### Email không gửi

Kiểm tra domain Resend, quyền API key, địa chỉ sender, `booking_email_jobs` và lần chạy worker. Booking vẫn được commit; worker chạy ngay sau action và Cron hằng ngày retry độc lập. Server chỉ log lỗi nội bộ.

### File `.ics` sai giờ

Booking nhập theo `Asia/Ho_Chi_Minh` và `.ics` được xuất dưới UTC. Kiểm tra ngày/slot lưu trong bản ghi trước khi xác nhận.

## Kích hoạt booking completion

Thực hiện checklist này cùng deployment chứa code booking completion.

### 1. Migrations và email worker

1. Chạy `004_booking_actions_and_audit.sql`, `005_booking_email_jobs.sql`, `006_booking_rate_limits.sql`, rồi `007_reserve_reschedule_slots.sql` đúng thứ tự.
2. Tạo `CRON_SECRET` ngẫu nhiên tối thiểu 32 ký tự trên Vercel Production/Preview.
3. Deploy `vercel.json` cùng route `/api/internal/booking-email-worker`; lịch `0 2 * * *` tương thích Hobby và chỉ là fallback hằng ngày vì worker đã chạy ngay sau mỗi action.
4. Submit một booking, xác nhận job chuyển `pending -> sending -> sent`.
5. Test Resend lỗi có kiểm soát ở preview và xác nhận `attempts`, `run_after`, `last_error` được cập nhật, không tạo job trùng.

### 2. Admin dashboard

- Secret này tách khỏi `BOOKING_SECRET`; rotate sẽ đăng xuất session admin nhưng không vô hiệu action booking.
- `ADMIN_EMAIL` là tài khoản duy nhất nhận magic link ở MVP.
- Sau deploy, thử email không phải admin, token sai/hết hạn, replay token và cookie production `HttpOnly; Secure; SameSite=Lax`.

### 3. Cloudflare Turnstile

1. Tạo Turnstile widget cho domain production và domain preview cần test.
2. Thêm site key/secret vào đúng Vercel environment:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
BOOKING_CAPTCHA_DISABLED=false
```

3. Production luôn fail closed nếu thiếu key. Local chỉ được bypass bằng `BOOKING_CAPTCHA_DISABLED=true` khi `NODE_ENV` không phải `production`.
4. Test token thiếu, token sai, token replay/expired và rate limit; client không được nhận raw Turnstile error.

### 4. Meeting provider MVP

```bash
BOOKING_MEETING_PROVIDER=jitsi
BOOKING_MEETING_URL_BASE=https://meet.jit.si
```

- Hệ thống tạo slug phòng ngẫu nhiên khi booking chuyển sang `confirmed`; không tạo ở trạng thái `pending`.
- `BOOKING_MEETING_LOCATION` chỉ là fallback rollout. Sau khi kiểm tra link trong email và `.ics`, bỏ fallback để tránh hai nguồn cấu hình.
- Jitsi URL generated locally giúp đạt MVP nhanh nhưng không đảm bảo host-control như Google Meet/Zoom; có thể thay adapter sau mà không đổi booking schema/flow.

### 5. Release order và rollback

1. Deploy additive migrations và code tương thích ngược.
2. Bật worker và quan sát queue.
3. Smoke test availability/date policy, admin, self-service, abuse control và meeting adapter.
4. Nếu một slice lỗi, rollback code slice đó; không xóa migration, action, job hoặc lịch sử booking đã ghi.
