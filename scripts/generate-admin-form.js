/* eslint-disable @typescript-eslint/no-require-imports */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        text: "FORM ĐIỀN THÔNG TIN CHO ADMIN",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: "Điền các thông tin phi kỹ thuật vào form này. Các phần technical sẽ do developer điền riêng.",
        spacing: { after: 400 },
        italics: true
      }),

      // Section A
      new Paragraph({
        text: "A. Thông tin về trang About - Phần Methodology",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "1. Quy trình nghiên cứu doanh nghiệp",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Nguồn dữ liệu chính bạn dùng là gì?", bold: true }),
          new TextRun("\n(VD: BCTC từ vietstock/cafef/trang IR, báo cáo thường niên, NDSR, Bloomberg...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Thứ tự phân tích: bắt đầu từ đâu?", bold: true }),
          new TextRun("\n(VD: đọc mô hình kinh doanh trước, hay xem tài chính trước?)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có cross-check với nguồn thứ cấp không?", bold: true }),
          new TextRun("\n(VD: báo chí, đối thủ cạnh tranh, khách hàng doanh nghiệp...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "2. Cách phân biệt fact / inference / assumption",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Quy trình hiện tại là gì?", bold: true }),
          new TextRun("\n(Đã dùng nhãn \"Dữ kiện / Nhận định / Giả định\" trong bài FPT — muốn mô tả thêm gì?)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "3. Quy trình update và sửa sai",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Khi phát hiện sai sót trong bài đã publish, quy trình xử lý là gì?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có ghi chú correction ở đầu bài không, hay edit thầm?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "4. Đội ngũ",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có mấy người tham gia? Vai trò là gì?", bold: true }),
          new TextRun("\n(VD: tác giả chính, researcher, editor...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có muốn nêu tên không, hay ẩn danh?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Ai trong team hiện có/không có vị thế trong các doanh nghiệp được phân tích?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      // Section B
      new Paragraph({
        text: "B. Thông tin cho trang Privacy Policy",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Data thu thập",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Booking form: tên, email, số điện thoại, ngày hẹn, lời nhắn → lưu ở đâu?", bold: true }),
          new TextRun("\n(VD: Google Sheet, Notion, email tới admin...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Email newsletter: có không? Dùng tool gì?", bold: true }),
          new TextRun("\n(VD: Mailchimp, Brevo, Buttondown...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Bên thứ ba nhận data",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Email provider gửi booking confirmation là gì?", bold: true }),
          new TextRun("\n(VD: Resend, SendGrid, Nodemailer + SMTP...)\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có bên thứ ba nào khác không?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Thời gian lưu data",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Booking requests lưu bao lâu?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Có quy trình xóa data không?", bold: true }),
          new TextRun("\n\n"),
          new TextRun("Trả lời:\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      // Section C
      new Paragraph({
        text: "C. Thông tin cho bài Business Research mới",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Chọn doanh nghiệp",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Tên: ", bold: true }),
          new TextRun("_".repeat(80) + "\n\n"),
          new TextRun({ text: "Ticker: ", bold: true }),
          new TextRun("_".repeat(80) + "\n\n"),
          new TextRun({ text: "Sàn: ", bold: true }),
          new TextRun("☐ HOSE    ☐ HNX    ☐ UPCOM\n\n"),
          new TextRun({ text: "Lý do chọn (1–2 câu):\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Nguồn dữ liệu bạn sẽ dùng",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Báo cáo thường niên năm: ", bold: true }),
          new TextRun("_".repeat(60) + "\n\n"),
          new TextRun({ text: "URL trang IR: ", bold: true }),
          new TextRun("_".repeat(70) + "\n\n"),
          new TextRun({ text: "Các nguồn khác:\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Số liệu tài chính chính (từ BCTC gần nhất)",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Doanh thu: ", bold: true }),
          new TextRun("_".repeat(70) + "\n\n"),
          new TextRun({ text: "Lợi nhuận ròng: ", bold: true }),
          new TextRun("_".repeat(65) + "\n\n"),
          new TextRun({ text: "Biên lợi nhuận ròng: ", bold: true }),
          new TextRun("_".repeat(60) + "\n\n"),
          new TextRun({ text: "ROE: ", bold: true }),
          new TextRun("_".repeat(75) + "\n\n"),
          new TextRun({ text: "Tăng trưởng doanh thu YoY: ", bold: true }),
          new TextRun("_".repeat(55) + "\n\n"),
          new TextRun({ text: "Nợ vay / EBITDA: ", bold: true }),
          new TextRun("_".repeat(65) + "\n\n"),
          new TextRun({ text: "Dòng tiền tự do (FCF): ", bold: true }),
          new TextRun("_".repeat(60) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Đánh giá sơ bộ",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Moat chính là gì?\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun({ text: "Rủi ro lớn nhất?\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun({ text: "Điều gì có thể khiến luận điểm sai?\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun({ text: "Bạn có đang nắm giữ cổ phiếu này không? (cần disclosure)\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      // Section D
      new Paragraph({
        text: "D. Update bài FPT (nếu cần)",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Nguồn: ", bold: true }),
          new TextRun("_".repeat(75) + "\n\n"),
          new TextRun({ text: "Doanh thu công nghệ nước ngoài Q1/Q2 2025: ", bold: true }),
          new TextRun("_".repeat(40) + "\n\n"),
          new TextRun({ text: "Tăng trưởng YoY: ", bold: true }),
          new TextRun("_".repeat(65) + "\n\n"),
          new TextRun({ text: "Biên lợi nhuận: ", bold: true }),
          new TextRun("_".repeat(65) + "\n\n"),
          new TextRun({ text: "Dòng tiền tự do: ", bold: true }),
          new TextRun("_".repeat(65) + "\n\n"),
          new TextRun({ text: "Thị trường Nhật/Mỹ/EU: ", bold: true }),
          new TextRun("_".repeat(60) + "\n\n"),
          new TextRun({ text: "Cập nhật đáng chú ý về chiến lược AI/automotive:\n", bold: true }),
          new TextRun("_".repeat(100) + "\n\n"),
          new TextRun("_".repeat(100) + "\n\n"),
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "---",
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: "Sau khi điền xong, gửi lại file này cho developer để tiếp tục xử lý các phần technical.",
        italics: true,
        alignment: AlignmentType.CENTER
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("docs/ADMIN-FORM.docx", buffer);
  console.log("✓ Created docs/ADMIN-FORM.docx");
});
