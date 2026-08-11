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

- `pending`: yêu cầu mới, chờ quản trị viên duyệt.
- `confirmed`: email xác nhận và file `.ics` đã gửi thành công.
- `reschedule_requested`: khách đã gửi đề xuất đổi lịch.

Các cột trạng thái email hỗ trợ retry có kiểm soát và tránh gửi trùng khi người dùng tải lại trang.
