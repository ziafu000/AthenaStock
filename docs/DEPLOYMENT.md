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
3. Xác nhận bảng `bookings`, RLS và hai partial unique index `bookings_customer_active_start_at_idx`, `bookings_confirmed_start_at_idx` đã có.

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
BOOKING_ACTION_TTL_HOURS=72
BOOKING_MEETING_LOCATION=
```

- Sinh `BOOKING_SECRET` ngẫu nhiên, tối thiểu 32 ký tự; không dùng giá trị mẫu.
- `NEXT_PUBLIC_APP_URL` phải là origin production để link trong email đúng host.
- `BOOKING_MEETING_LOCATION` là tùy chọn; có thể là địa chỉ hoặc link phòng họp tự quản lý.
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

Kiểm tra domain Resend, quyền API key, địa chỉ sender và giới hạn sandbox. Server chỉ log lỗi nội bộ; client không nhận provider error thô.

### File `.ics` sai giờ

Booking nhập theo `Asia/Ho_Chi_Minh` và `.ics` được xuất dưới UTC. Kiểm tra ngày/slot lưu trong bản ghi trước khi xác nhận.
