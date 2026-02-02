import { ShieldAlert } from "lucide-react"

export const metadata = {
    title: "Miễn trừ Trách nhiệm – Đầu tư tỉnh thức",
    description: "Tuyên bố miễn trừ trách nhiệm pháp lý về nội dung trên website.",
}

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-20 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100/50 dark:bg-red-900/20 mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-700 dark:text-red-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Miễn trừ Trách nhiệm
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Vui lòng đọc kỹ các điều khoản sau trước khi sử dụng nội dung từ website này.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container max-w-3xl">
                    <article className="prose prose-neutral dark:prose-invert mx-auto">
                        <h2>1. Không phải Tư vấn Đầu tư</h2>
                        <p>
                            Tất cả nội dung trên website <strong>Đầu tư tỉnh thức</strong> — bao gồm
                            bài viết, phân tích doanh nghiệp, framework, và các tài liệu khác —
                            chỉ mang tính chất <strong>thông tin và giáo dục</strong>.
                        </p>
                        <p>
                            Nội dung này <strong>KHÔNG</strong> phải là:
                        </p>
                        <ul>
                            <li>Tư vấn đầu tư (investment advice)</li>
                            <li>Khuyến nghị mua hoặc bán bất kỳ chứng khoán nào</li>
                            <li>Lời hứa hoặc cam kết về lợi nhuận</li>
                            <li>Phân tích chính thức từ tổ chức tài chính được cấp phép</li>
                        </ul>

                        <h2>2. Rủi ro Đầu tư</h2>
                        <p>
                            Đầu tư chứng khoán và các công cụ tài chính khác luôn tiềm ẩn rủi ro,
                            bao gồm khả năng <strong>mất một phần hoặc toàn bộ vốn đầu tư</strong>.
                        </p>
                        <p>
                            Kết quả trong quá khứ không đảm bảo kết quả trong tương lai.
                            Mọi quyết định đầu tư cần được cân nhắc kỹ lưỡng dựa trên
                            tình hình tài chính cá nhân, mức độ chấp nhận rủi ro, và
                            mục tiêu đầu tư của riêng bạn.
                        </p>

                        <h2>3. Độ chính xác của Thông tin</h2>
                        <p>
                            Mặc dù chúng tôi nỗ lực đảm bảo tính chính xác của thông tin,
                            chúng tôi <strong>không cam kết</strong> rằng tất cả nội dung đều
                            hoàn toàn chính xác, đầy đủ, hoặc cập nhật.
                        </p>
                        <p>
                            Các ước tính, dự đoán, và quan điểm được trình bày phản ánh
                            đánh giá cá nhân tại thời điểm viết và có thể thay đổi mà không báo trước.
                        </p>

                        <h2>4. Không liên kết với Doanh nghiệp</h2>
                        <p>
                            Việc phân tích bất kỳ doanh nghiệp nào trên website không có nghĩa
                            là chúng tôi có liên kết, hợp tác, hoặc đại diện cho doanh nghiệp đó.
                        </p>

                        <h2>5. Tự chịu Trách nhiệm</h2>
                        <p>
                            Bạn hoàn toàn tự chịu trách nhiệm về mọi quyết định đầu tư của mình.
                            Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất tài chính nào
                            phát sinh từ việc sử dụng thông tin trên website.
                        </p>
                        <p>
                            Trước khi đưa ra quyết định đầu tư quan trọng, bạn nên tham khảo
                            ý kiến của chuyên gia tài chính được cấp phép.
                        </p>

                        <h2>6. Không Bảo mật Thông tin Giao dịch</h2>
                        <p>
                            Website không thu thập thông tin về danh mục đầu tư hay
                            giao dịch chứng khoán của bạn. Mọi ghi chú (notes/highlights)
                            đều được lưu trữ cục bộ trên trình duyệt của bạn (localStorage)
                            và không được gửi về máy chủ.
                        </p>
                    </article>
                </div>
            </section>

            {/* Footer Info */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-3xl">
                    <div className="rounded-lg border bg-background p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            <strong className="text-foreground">Ngày có hiệu lực:</strong> 01/01/2024
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Cập nhật lần cuối:</strong> 01/01/2024
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Nếu có bất kỳ câu hỏi nào về các điều khoản này,
                            vui lòng liên hệ qua trang <a href="/about" className="text-accent hover:text-accent/80 underline">Giới thiệu</a>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
