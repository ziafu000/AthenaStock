# API Routes

Các contract backend dưới đây giữ nguyên UI/UX hiện tại. Booking dùng PostgreSQL + Resend + file lịch `.ics`, không phụ thuộc nhà cung cấp lịch bên ngoài.

## POST `/api/booking`

Tạo yêu cầu booking ở trạng thái `pending` và gửi email duyệt tới quản trị viên.

```json
{
  "name": "Nguyen Van A",
  "email": "email@example.com",
  "phone": "0123456789",
  "date": "2026-08-20",
  "timeBlock": "14:00 - 15:00 (Chiều)",
  "message": "Nội dung cần trao đổi"
}
```

`name`, `email`, `date`, `timeBlock` là bắt buộc. Ngày phải hợp lệ và không nằm trong quá khứ. Khung giờ phải thuộc sáu lựa chọn của form.

Thành công:

```json
{ "success": true, "bookingId": "uuid", "duplicate": false }
```

Gửi lại cùng email và thời điểm là idempotent. Nhiều khách hàng khác nhau có thể gửi yêu cầu cho cùng một khung giờ; mỗi yêu cầu mới đều được lưu và thông báo cho quản trị viên. Lỗi cấu hình hoặc email trả `503` nhưng bản ghi được giữ để retry.

## GET và POST `/api/booking/confirm?token=...`

Link trong email quản trị dùng token HMAC có mục đích `confirm`, booking ID và hạn dùng.

- `GET`: chỉ hiển thị trang xem trước; không đổi dữ liệu và không gửi email.
- `POST`: xác minh token và atomically chuyển booking sang `confirmed` trước khi gửi email kèm file `.ics`. Unique index đảm bảo chỉ một yêu cầu trong mỗi khung giờ được xác nhận, kể cả khi hai thao tác duyệt chạy đồng thời.
- Nếu gửi email khách hàng lỗi, slot vẫn được giữ bởi booking `confirmed`; quản trị viên có thể retry bằng cùng liên kết.
- Token hết hạn, sai chữ ký hoặc sai mục đích bị từ chối.
- Thao tác đã gửi thành công không được phát lại.

## GET `/api/booking/reschedule?id=...&token=...`

Xác minh token `reschedule` và trả dữ liệu booking cần thiết cho trang đổi lịch. Response đặt `Cache-Control: no-store`; URL không chứa tên, email hay nội dung riêng tư.

## POST `/api/booking/reschedule`

```json
{
  "id": "booking-uuid",
  "token": "signed-token",
  "suggestions": [
    { "date": "2026-08-21", "timeBlock": "10:00 - 11:00 (Sáng)" }
  ]
}
```

Nhận từ một đến năm gợi ý không trùng nhau. Sau khi xác minh token, hệ thống gửi email gợi ý mới; nếu lịch cũ đã được xác nhận, email kèm `.ics` hủy lịch cũ. Booking chuyển sang `reschedule_requested` sau khi gửi thành công.

## POST `/api/subscribe`

Nhận `{ "email": "subscriber@example.com" }`, gửi email chào mừng và thông báo quản trị. Danh sách subscriber hiện vẫn do Resend quản lý.

## GET `/api/search?q=keyword`

Tìm kiếm không phân biệt hoa thường trong title, description, tags và nội dung MDX. Response gồm `results` và `count`.

## Biến môi trường

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=admin@example.com
SENDER_EMAIL=Athena Stock <booking@example.com>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BOOKING_SECRET=a-random-secret-at-least-32-characters
BOOKING_ACTION_TTL_HOURS=72
BOOKING_MEETING_LOCATION=
```

`BOOKING_ACTION_TTL_HOURS` mặc định 72 giờ và tối đa 168 giờ. `BOOKING_MEETING_LOCATION` là tùy chọn, dùng cho địa điểm/link họp do quản trị viên tự quản lý.

## Mã trạng thái chính

| Status | Ý nghĩa |
|---|---|
| `400` | Input không hợp lệ |
| `401` | Token sai hoặc hết hạn |
| `404` | Không tìm thấy booking |
| `409` | Khung giờ đã có booking được xác nhận hoặc action đã hoàn tất/đang xử lý |
| `503` | Database, email hoặc cấu hình chưa sẵn sàng |

Không trả raw provider error cho client. User input được validate trước khi lưu và escape trước khi đưa vào HTML email.

## Khởi tạo database

Chạy lần lượt mọi migration trong [`database/migrations/`](../database/migrations/) trước khi bật booking. Migration `002` khóa dữ liệu booking khỏi Supabase Data API bằng RLS. Chi tiết tại [`database/README.md`](../database/README.md).

## Kiểm tra local

1. Tạo `.env.local` và điền các biến database/Resend được liệt kê trong `docs/DEPLOYMENT.md`.
2. Chạy migration.
3. Chạy `npm run dev` và submit form.
4. Mở email admin: GET chỉ preview; bấm nút xác nhận mới tạo POST.
5. Kiểm tra email khách có file `.ics`, và thử lại link để xác nhận không gửi trùng.
