# Thông tin cần chuẩn bị để đưa cho AI làm

> Phiên bản tổng hợp các nội dung đã thống nhất trong quá trình chuẩn bị AthenaStock.
>
> **ĐÃ CHỐT** = yêu cầu nghiệp vụ chính thức.  
> **ĐỂ MỞ** = chưa chọn công cụ/cách triển khai; không tự suy đoán.  
> **ROADMAP SAU** = định hướng dài hạn, chưa triển khai phiên bản hiện tại.

---

## A. About page — Methodology section

### 1. Quy trình nghiên cứu doanh nghiệp

**Triết lý:** AthenaStock là **Investment Thinking House**, với tư duy đầu tư như một người chủ doanh nghiệp: hiểu doanh nghiệp, hiểu chính mình và xây dựng tài sản bền vững.

**Quy trình:**
1. Bắt đầu từ bối cảnh vĩ mô.
2. So sánh các ngành có lợi thế/triển vọng.
3. Chọn khoảng 1–3 doanh nghiệp nổi bật.
4. Đánh giá quy mô và tăng trưởng: doanh thu, lợi nhuận ròng, tăng trưởng doanh thu/lợi nhuận.
5. Đánh giá ROE, ROA, biên lợi nhuận, P/E, P/B, P/S, nợ, dòng tiền và chỉ số đặc thù.
6. So sánh quý với quý liền trước (QoQ), quý cùng kỳ (YoY), năm với năm (YoY), chu kỳ 3 năm bằng CAGR.
7. Có thể mở rộng sang 5 năm, trung bình ngành, Top 1–3, Research forecast, lịch sử định giá và từng mảng kinh doanh.
8. Đối chiếu với dự phóng Vietcap Research qua Vietcap IQ khi phù hợp.
9. Phân tích kỹ thuật: MA, RSI, MACD, Bollinger Bands và các chỉ báo phù hợp.
10. Đánh giá xu hướng ngắn/trung/dài hạn.
11. Đưa doanh nghiệp vào Watchlist khi phù hợp.
12. Từ toàn bộ dữ liệu và luận điểm mới đi đến quyết định đầu tư phù hợp với cấp thành viên.

**Nguồn dữ liệu:** báo cáo thường niên, BCTC, website IR, dữ liệu thị trường, báo chí, báo cáo bên thứ ba, Simplize.vn, Vietcap IQ (`trading.vietcap.com.vn/iq`), FireAnt và Vietcap Research khi phù hợp.

**Cross-check:** đối chiếu nhiều nguồn; khi mâu thuẫn, ưu tiên nguồn gốc, đặc biệt BCTC/báo cáo chính thức của doanh nghiệp. Không để dữ liệu mới làm mất lịch sử dữ liệu cũ.

### 2. Fact / inference / assumption

Mọi luận điểm quan trọng phải được gắn một trong ba nhãn:
- **DỮ KIỆN** — thông tin/số liệu có nguồn kiểm chứng.
- **NHẬN ĐỊNH** — kết luận/phân tích dựa trên dữ kiện.
- **GIẢ ĐỊNH** — giả định dùng cho kịch bản/luận điểm.

Không trình bày nhận định hoặc giả định như dữ kiện.

### 3. Update và sửa sai

Không sửa âm thầm bài đã publish khi có thay đổi quan trọng.

- **Update:** thông tin/dữ liệu mới → tạo phiên bản cập nhật.
- **Correction:** phát hiện sai sót → tạo correction, liên kết với bài cũ và có thể thông báo rõ mục đích đính chính.
- Phiên bản cũ không bị mất.
- Người dùng mặc định xem phiên bản hiện hành; có thể xem lịch sử update/correction.
- Athenaster/Admin xem lịch sử chi tiết.

### 4. Đội ngũ

Hiện tại: **một người vận hành/nghiên cứu**.

Tác giả có thể dùng ID như `Athenaster_1`, `Athenaster_2`... thay vì bắt buộc công khai danh tính thật.

Visibility:
- ID Only
- Public Profile
- Extended Profile

Public Profile có thể gồm Bio, Expertise, Research Areas, Philosophy, Published Articles.

**Disclosure:** việc Athenaster có nắm giữ cổ phiếu không phải trọng tâm của phương pháp; phân tích dựa trên fundamental và technical. Tuy nhiên, nếu Athenaster đang nắm giữ cổ phiếu được phân tích thì cố gắng disclosure trong từng bài.

---

## B. Trang `/privacy`

### Data thu thập

**Booking form:** họ tên, số điện thoại, email, ngày/giờ mong muốn, lời nhắn.

**Nơi lưu booking data:** **ĐỂ MỞ** — AD trao đổi với người phụ trách thiết kế/phát triển website để quyết định sau.

**Email newsletter:** Có. Provider **ĐỂ MỞ**.

**Analytics:** Vercel Analytics đang dùng. Chưa chọn thêm GA, Hotjar hay công cụ khác; **ĐỂ MỞ**.

Mục tiêu analytics: hiểu hành vi và đường chuyển đổi:
`Người đọc → Newsletter → Member → Athenan Normal → VIP`.

**Reader notes/highlights:** chỉ lưu trong `localStorage`, không gửi lên server.

### Bên thứ ba nhận data

Đã xác định:
- **Vercel** — hosting + analytics.
- **Cloudflare Turnstile** — captcha/chống spam trong booking form.

**Email provider:** ĐỂ MỞ.

**Bên thứ ba khác:** chưa xác định; chỉ bổ sung khi AthenaStock thực sự tích hợp dịch vụ mới.

Khi tích hợp thêm dịch vụ có xử lý dữ liệu người dùng, cần cập nhật danh sách bên thứ ba và chính sách dữ liệu tương ứng.

### Thời gian lưu data

- Booking requests lưu bao lâu: **ĐỂ MỞ**.
- Quy trình xóa data: **ĐỂ MỞ**.

AD sẽ trao đổi với người phụ trách website để quyết định sau.

---

## C. Bài Business Research mới

### 1. Chọn doanh nghiệp

**Doanh nghiệp mẫu:** Công ty Cổ phần FPT  
**Ticker:** FPT  
**Sàn:** HOSE

**Lý do chọn:** Công nghệ và AI có khả năng tiếp tục phát triển trong nhiều thập kỷ do sự tiến hóa tất yếu của công nghệ và xã hội. FPT là một tập đoàn công nghệ lớn của Việt Nam, tham gia sớm và rộng trong lĩnh vực công nghệ, đồng thời duy trì tăng trưởng và vị thế dẫn đầu.

### 2. Nguồn dữ liệu

Ưu tiên: báo cáo thường niên, BCTC, website IR, dữ liệu thị trường, báo chí và nguồn/nghiên cứu bên thứ ba.

Đối chiếu: Simplize.vn, Vietcap IQ, FireAnt và Vietcap Research khi có dự phóng phù hợp.

**Cửa sổ dữ liệu:**
- Chu kỳ mục tiêu 3 năm: tối thiểu **5 năm BCTC gần nhất** tính từ thời điểm nghiên cứu.
- Chu kỳ quý hiện tại: **8 quý gần nhất**.

### 3. Số liệu tài chính chính

**Tăng trưởng:** doanh thu, tăng trưởng doanh thu, lợi nhuận ròng, tăng trưởng lợi nhuận ròng, QoQ, YoY.

**Sinh lời:** biên lợi nhuận gộp, biên lợi nhuận hoạt động, biên lợi nhuận ròng, ROE, ROA.

**Sức khỏe tài chính:** nợ vay, net debt, tiền mặt, net debt/EBITDA, dòng tiền hoạt động, FCF.

**Định giá:** P/E, P/B, P/S.

**Chỉ số đặc thù:** có thể bổ sung tùy doanh nghiệp/ngành.

Bộ tiêu chí là **mở rộng được**, không phải danh sách đóng.

### 4. So sánh

- Quý: QoQ và YoY.
- Năm: YoY.
- Chu kỳ 3 năm: CAGR.
- Có thể mở rộng sang 5 năm, trung bình ngành, Top 1–3, Research forecast, lịch sử định giá và từng mảng kinh doanh.

### 5. Cấu trúc Research Article

1. Tóm tắt doanh nghiệp.
2. Thesis.
3. Kết quả kinh doanh.
4. Sức khỏe tài chính.
5. Định giá.
6. Triển vọng.
7. Phân tích kỹ thuật.
8. Kết luận.
9. Nguồn và thời điểm dữ liệu.
10. Lịch sử Update/Correction.

Cấu trúc có thể mở rộng.

### 6. Trạng thái Research

**Nội bộ (AD/Athenaster):**
- Draft
- Checking
- Pending Approval
- VIP Published
- Normal Open
- Updated
- Corrected
- Archived
- Unpublished/Cancelled

**Hiển thị cho người dùng:**
- VIP-only
- Ngày cập nhật
- Correction
- Archived

Trạng thái nội bộ và nhãn hiển thị là hai lớp riêng.

### 7. Quyền truy cập và VIP-first

- **Public:** nội dung Public + teaser nội dung thành viên.
- **Normal:** Public + nội dung Normal sau 8 giờ.
- **VIP:** Public + Normal + VIP ngay khi publish.
- **Admin/Athenaster:** theo Permission.

**8 giờ** tính từ thời điểm hệ thống ghi nhận bài Research đã **Published thành công**. Ví dụ publish 10:30 → VIP xem 10:30 → Normal mở 18:30.

**Global VIP Override:** AD có thể mở nội dung VIP cho tất cả thành viên trong số ngày cấu hình và tắt lại bằng một thao tác. Khi tắt/hết thời gian, quy tắc 8 giờ trở lại.

Quyền phải được kiểm tra ở tầng hệ thống/backend, không chỉ ẩn bằng giao diện.

### 8. Nâng cấp Normal → VIP

Normal bấm **Đăng ký thành viên VIP** trong nội dung bị khóa.

Quy trình:
1. Dùng tài khoản hiện tại.
2. Chọn gói.
3. Tự điền thông tin.
4. Tạo yêu cầu.
5. Hiển thị hướng dẫn thanh toán.
6. Upload bằng chứng thanh toán.
7. AD/Athenaster_AD nhận thông báo.
8. Duyệt.
9. Tự động chuyển Normal → VIP.
10. Quay lại bài viết ban đầu.

### 9. Lưu tiến trình nâng cấp

Cho phép tiếp tục yêu cầu chưa hoàn tất.

Trạng thái:
- Started
- Package Selected
- Instructions Shown
- Proof Uploaded
- Waiting Review
- Approved
- Rejected
- Cancelled
- Expired

Không tự động hủy yêu cầu đã gửi bằng chứng thanh toán. Không tạo nhiều yêu cầu active trùng nhau.

### 10. Review/Activate

AD/Athenaster_AD có thể:
- Approve
- Request More Information
- Reject
- Assign

Có chống double approval, Role/Permission và Audit Log.

### 11. Gia hạn VIP

- Gia hạn khi còn hiệu lực → nối tiếp sau ngày hết hạn hiện tại.
- Gia hạn sau khi hết hạn → kích hoạt lại từ thời điểm được duyệt.
- Thanh toán/bằng chứng thanh toán không tự kích hoạt VIP.
- Chưa có refund/convert tự động; nếu phát sinh xử lý thủ công.

### 12. Thanh toán sai/thiếu/không khớp

Không tự động kích hoạt.

Có thể:
- Yêu cầu bổ sung.
- Đối soát thủ công.
- Reject.

Không xóa chứng từ/yêu cầu.

Trạng thái:
- Needs More Information
- Payment Unmatched
- Manual Review
- Payment Confirmed
- Refund Pending

### 13. Gói VIP

- 1 tháng
- 3 tháng
- 6 tháng
- 12 tháng

AD quản lý gói, giá, trạng thái, thứ tự hiển thị.

Giao dịch cũ giữ giá tại thời điểm giao dịch.

Khuyến mại phức tạp: **ĐỂ MỞ/ĐỂ SAU**.

### 14. Tài khoản ngân hàng

AD quản lý:
- Ngân hàng.
- Chủ tài khoản.
- Số tài khoản.
- QR.
- Trạng thái.

Thay đổi tài khoản:
- OTP.
- Audit Log.

Log: Bank Account Changed, Old Account, New Account, Changed By, Time, OTP Verified.

Yêu cầu thanh toán cũ giữ thông tin tài khoản ngân hàng tại thời điểm tạo.

### 15. Nội dung chuyển khoản và mô hình pháp lý/thanh toán

Thanh toán VIP được mô tả đúng bản chất là **phí cho quyền truy cập nghiên cứu/dịch vụ thành viên**, không gọi là ủng hộ, tặng quà hay phí cộng đồng; không mô tả như khoản đầu tư, dịch vụ môi giới hoặc cam kết lợi nhuận.

Mã giao dịch ngắn, không đưa thông tin cá nhân vào nội dung chuyển khoản, ví dụ:
- `ATHENA DK V03 R7K2`
- `ATHENA GH V03 R7K2`

Lưu Request ID, gói, giá, tài khoản ngân hàng/entity tại thời điểm tạo, nội dung giao dịch và thông tin liên quan.

**Mô hình pháp lý/tax entity:** CHƯA QUYẾT ĐỊNH; sẽ trao đổi với kế toán/tư vấn phù hợp trước khi triển khai chính thức.

### 16. Biên nhận/xác nhận thanh toán

Tách 3 mốc:
1. Tạo yêu cầu → xác nhận đã tạo, chưa phải xác nhận thanh toán.
2. Nhận bằng chứng → đã nhận chứng từ, đang chờ kiểm tra.
3. Payment Confirmed/VIP Activated → thanh toán được duyệt và VIP được kích hoạt/cập nhật.

Phân biệt biên nhận hệ thống với hóa đơn/chứng từ pháp lý. Không cam kết hóa đơn pháp lý trước khi entity/mô hình thuế được quyết định.

### 17. Thông báo

Theo trạng thái:
- Tạo yêu cầu.
- Nhận bằng chứng.
- Thanh toán được duyệt.
- Cần bổ sung.
- Từ chối.
- VIP sắp hết hạn.

Kênh:
- Website: chính.
- Email: bổ sung nếu người dùng đồng ý.
- Telegram: thông báo nội bộ AD/Athenaster_AD.
- Zalo: để sau.

Có thể cấu hình nhắc hết hạn; đề xuất ban đầu 7 ngày, 3 ngày, 1 ngày.

### 18. Hồ sơ Athenan

Gồm:
- Athenan ID.
- Username.
- Họ tên.
- Email.
- Số điện thoại.
- Trạng thái định danh.
- Normal/VIP.
- Ngày bắt đầu/hết hạn.
- Gói.
- Lịch sử gói.
- Permissions.
- Lịch sử thanh toán.
- Activity History.

Có thể bắt đầu bằng Athenan_01... Khi xác minh danh tính, không tạo tài khoản mới; giữ lịch sử và cập nhật quyền nếu đủ điều kiện.

Thay đổi quan trọng phải có Audit Log.

### 19. Phân quyền nội dung

- Public → Public.
- Normal → Public + Normal sau 8 giờ.
- VIP → Public + Normal + VIP.
- Admin/Athenaster → theo Permission.

### 20. Watchlist

Mỗi Athenan có Watchlist cá nhân.

Có thể thêm/xóa doanh nghiệp, xem bài liên quan và cập nhật gần nhất.

Trạng thái:
- Đang theo dõi.
- Chờ thêm dữ liệu.
- Đang cập nhật.
- Đã hoàn tất nghiên cứu.
- Tạm dừng theo dõi.

Watchlist không đồng nghĩa khuyến nghị mua/bán.

### 21. Research Update và cảnh báo

Research Update có thể liên quan đến:
- Kết quả kinh doanh.
- Thesis.
- Định giá.
- Triển vọng.
- Technical analysis.
- Correction.

Mức độ:
- Thông thường.
- Đáng chú ý.
- Quan trọng.

Cảnh báo tuân thủ quyền Public/Normal/VIP.

### 22. Bình luận và trao đổi

**Normal:** trao đổi về nghiên cứu; không mặc định là tư vấn cá nhân hóa.

**VIP:** trao đổi riêng và có 1-1 Advice theo quyền VIP.

Athenaster/AD có thể ẩn, xóa/khóa khi cần, ghim, đánh dấu đã trả lời. Thao tác quản trị quan trọng có Audit Log.

Bình luận không tự động là kết luận nghiên cứu chính thức.

### 23. Hồ sơ doanh nghiệp

Mỗi doanh nghiệp có trang riêng gồm:
- Thông tin cơ bản.
- Ngành/lĩnh vực.
- Mảng kinh doanh.
- Research.
- Kết quả kinh doanh.
- Sức khỏe tài chính.
- Định giá.
- Triển vọng.
- Technical analysis.
- Research Update.
- Correction.
- Watchlist.

Dữ liệu và Research Article là các lớp riêng nhưng liên kết. Lịch sử không bị ghi đè.

Cơ chế lấy dữ liệu tự động và tần suất cập nhật: **ĐỂ MỞ**.

### 24. Tìm kiếm và bộ lọc

Tìm kiếm:
- Tên doanh nghiệp.
- Ticker.
- Tên bài.
- Từ khóa.
- Ngành.
- Chủ đề.
- Athenaster.

Bộ lọc:
- Research.
- Research Update.
- Correction.
- Framework.
- Tâm lý & Hành vi.
- Series.
- Public/Normal/VIP.
- Doanh nghiệp.
- Thời gian.
- Athenaster.

Kết quả luôn tuân thủ quyền truy cập.

Tìm kiếm sâu trong dữ liệu: **để sau**.

### 25. Trang cá nhân Athenan

Gồm:
- Thông tin cá nhân.
- Membership.
- Gói.
- Ngày hết hạn.
- Watchlist.
- Bài đã lưu.
- Lịch sử nghiên cứu/đọc.
- Thanh toán.
- Yêu cầu nâng cấp/gia hạn.
- Thông báo.
- Cài đặt.

Thông tin cá nhân và dữ liệu nhạy cảm không mặc định công khai.

### 26. Lưu bài và lịch sử đọc

- Có thể lưu/bỏ lưu bài.
- Lưu bài đã mở và thời điểm đọc gần nhất.
- Chưa tracking chi tiết thời gian/% đọc/số lần đọc ở phiên bản đầu.
- Lịch sử đọc là dữ liệu riêng tư.

### 27. Trung tâm thông báo

Thông báo gồm Research mới, Research Update, Correction, Watchlist, Membership, Thanh toán và Hệ thống.

Có đã đọc/chưa đọc, đánh dấu tất cả đã đọc và link đến nội dung liên quan.

Phải tuân thủ quyền truy cập.

Thời gian lưu lịch sử thông báo: **ĐỂ MỞ**.

### 28. Dashboard sau đăng nhập

**Normal:** Research mới, Watchlist updates, VIP teaser/locked content, bài đã lưu, nội dung gần đây, membership.

**VIP:** Research ưu tiên, Research Update, Watchlist alerts, Portfolio, membership/renewal.

**Public:** triết lý, methodology, nội dung Public, chủ đề, giới thiệu, CTA thành viên.

Trọng tâm: **Nghiên cứu → Hiểu doanh nghiệp → Theo dõi → Cập nhật → Ra quyết định có cơ sở.**

### 29. Portfolio cá nhân VIP

Mỗi VIP hiện có **1 Portfolio chính**.

Có thể nhập mã cổ phiếu, số lượng, giá vốn; hiển thị giá hiện tại, giá trị, lãi/lỗ, tỷ trọng; có thể thêm/sửa/xóa/xem lịch sử.

Watchlist = đang quan tâm. Portfolio = khai báo đang nắm giữ.

Portfolio là dữ liệu riêng tư.

Giai đoạn đầu:
- Nhập thủ công.
- Không kết nối broker.
- Không đặt lệnh.

### 30. Nhiều Portfolio / tài khoản

Hiện tại: mỗi VIP có 1 Portfolio chính.

Kiến trúc mở để tương lai hỗ trợ nhiều Portfolio, nhiều tài khoản/broker, đồng bộ danh mục, transactions và orders.

**ROADMAP SAU:** kết nối tài khoản chứng khoán và kết nối đặt lệnh. Chưa triển khai hiện tại.

### 31. Source Records

Mỗi Research Article có Source Records riêng.

Có thể lưu:
- Tên nguồn.
- Loại nguồn.
- URL/tài liệu.
- Ngày công bố.
- Ngày AthenaStock truy cập.
- Doanh nghiệp.
- Bài nghiên cứu.
- Người thêm.
- Ghi chú.

Không để nguồn mới ghi đè mất lịch sử.

Nội dung bên thứ ba chỉ dùng trong phạm vi quyền được phép.

### 32. Version History

Mỗi bài có lịch sử phiên bản.

- **Update:** thông tin mới.
- **Correction:** sửa sai.

Lưu version, người thay đổi, thời gian, nội dung thay đổi, lý do, nguồn liên quan và trạng thái trước/sau.

Người dùng mặc định xem phiên bản hiện hành.

### 33. Quy trình kiểm duyệt

`DRAFT → CHECKING → PENDING APPROVAL → PUBLISHED → VIP-FIRST → NORMAL OPEN sau đúng 8 giờ`

Draft: viết, dữ liệu, nguồn, nhãn DỮ KIỆN/NHẬN ĐỊNH/GIẢ ĐỊNH.

Checking: số liệu, nguồn, logic, tính toán, disclosure, quyền hiển thị.

Pending Approval: chờ người có quyền duyệt.

Published: lưu người duyệt, thời gian, version và thời điểm VIP bắt đầu.

Nếu bị trả lại: Request Changes + lý do → chỉnh sửa → Checking.

Sau publish không sửa âm thầm; thông tin mới = Update, sai sót = Correction.

### 34. Role / Permission

Không hard-code toàn bộ quyền vào Role.

Quyền nội dung gồm:
- Create Content.
- Edit Own Content.
- Edit Any Content.
- Submit for Review.
- Review Content.
- Approve Content.
- Publish Content.
- Unpublish Content.
- Create Update.
- Create Correction.
- View Audit Log.

Role hiện tại:
- Athenaster.
- Athenaster_AD.
- AD.

Có thể bổ sung:
- Content Manager.
- Member Manager.
- Các role khác.

Role là nhãn; Permission là quyền thực tế. Một user có thể có nhiều role. Phân quyền có thể thay đổi/bổ sung trong tương lai.

### 35. Mốc 8 giờ

8 giờ tính từ thời điểm hệ thống ghi nhận bài Research đã **Published thành công**.

Ví dụ: publish 10:30 → VIP 10:30 → Normal 18:30.

Global VIP Override có thể mở sớm.

### 36. 1-1 Advice

VIP có quyền sử dụng **1-1 Advice**.

Giai đoạn đầu có thể dùng kênh bên ngoài phù hợp; kênh cụ thể **ĐỂ MỞ**.

Định hướng dài hạn: xây **1-1 Advice Center** trong AthenaStock.

Các quy tắc chi tiết về kênh, thời gian lưu, file đính kèm, SLA: **ĐỂ MỞ**.

### 37. Quyền riêng tư Portfolio và 1-1 Advice

**Portfolio:** chỉ Athenan sở hữu được xem/chỉnh sửa; không công khai; Athenaster/AD không mặc định được xem, chỉ theo Permission/mục đích nghiệp vụ phù hợp.

**1-1 Advice:** trao đổi riêng tư, không công khai, Athenan khác không được xem; quyền nội bộ giới hạn theo Permission/mục đích nghiệp vụ.

**Audit Log:** ghi sự kiện quản trị cần thiết, không đưa toàn bộ nội dung riêng tư vào log.

---

## D. Update bài FPT

**CHƯA THỰC HIỆN — ĐỂ SAU.**

Nguồn dự kiến: `https://fpt.com.vn/en/investor-relations`

Khi thực hiện cần cập nhật:
- Doanh thu công nghệ nước ngoài Q1/Q2 2025.
- Tăng trưởng YoY.
- Biên lợi nhuận.
- FCF.
- Thị trường Nhật/Mỹ/EU.
- Cập nhật đáng chú ý về chiến lược AI/automotive.

---

# Nguyên tắc tổng thể dành cho Coding Agent

1. Không tự suy đoán các phần **ĐỂ MỞ**.
2. Không biến **ROADMAP SAU** thành chức năng phải xây hiện tại.
3. Chốt nghiệp vụ trước; công cụ kỹ thuật có thể quyết định sau.
4. Kiến trúc mở rộng được nhưng không over-engineer phiên bản đầu.
5. Quyền truy cập nội dung phải được kiểm tra ở tầng hệ thống/backend.
6. Dữ liệu lịch sử quan trọng không được ghi đè/xóa âm thầm.
7. Thao tác nhạy cảm phải có Audit Log.
8. Dữ liệu riêng tư phải được phân quyền.
9. Research phải phân biệt DỮ KIỆN / NHẬN ĐỊNH / GIẢ ĐỊNH.
10. Khi xung đột dữ liệu, ưu tiên nguồn gốc/chính thức.
11. Quyết định kỹ thuật cụ thể có thể do người phụ trách thiết kế/phát triển website trao đổi với AD để lựa chọn sau.

---

## Trạng thái cuối

### ĐÃ CHỐT
- A — Methodology.
- B — Privacy/Data và các nguyên tắc đã xác định.
- C — Business Research, Membership, Content, User, Portfolio, Permission.
- VIP-first / 8 giờ.
- Update / Correction / Version.
- Watchlist / Research Update.
- Payment / Membership.
- Audit Log.

### ĐỂ MỞ
- Newsletter provider.
- Booking data storage.
- Analytics bổ sung.
- Email provider.
- Các bên thứ ba khác.
- Thời gian lưu/xóa Booking.
- Cơ chế lấy dữ liệu tự động và tần suất cập nhật.
- Thời gian lưu notification history.
- Kênh/quy tắc chi tiết 1-1 Advice.
- Mô hình pháp lý/tax entity.
- Các lựa chọn kỹ thuật khác cần AD và người phụ trách website quyết định.

### ROADMAP SAU
- Nhiều Portfolio.
- Nhiều tài khoản/broker.
- Đồng bộ danh mục.
- Kết nối tài khoản chứng khoán.
- Kết nối đặt lệnh.
- 1-1 Advice Center.
- Analytics nâng cao.
- Search sâu.
- Membership/promotion phức tạp hơn.

### CHƯA LÀM
- D — Update bài FPT.
