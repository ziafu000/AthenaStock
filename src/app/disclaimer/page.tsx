import { ShieldAlert, BookOpen, TrendingUp, Search, RefreshCw, Award, Database } from "lucide-react"

export const metadata = {
    title: "Miễn trừ Trách nhiệm – Athena Stock",
    description: "Tuyên bố miễn trừ trách nhiệm pháp lý về nội dung trên website.",
}

const disclaimerClauses = [
    {
        title: "Không phải Tư vấn Đầu tư",
        icon: BookOpen,
        content: (
            <>
                Tất cả nội dung trên website <strong className="text-white">Athena Stock</strong> — bao gồm bài viết, phân tích doanh nghiệp, framework và tài liệu khác — chỉ nhằm mục đích <strong className="text-white">nghiên cứu và giáo dục</strong>. Việc nghiên cứu một doanh nghiệp không đồng nghĩa với lời khuyên phù hợp cho hoàn cảnh cá nhân và <strong className="text-red-400">KHÔNG</strong> phải khuyến nghị mua hoặc bán chứng khoán.
            </>
        ),
    },
    {
        title: "Rủi ro Đầu tư",
        icon: TrendingUp,
        content: (
            <>
                Đầu tư chứng khoán luôn tiềm ẩn rủi ro, bao gồm khả năng <strong className="text-white">mất một phần hoặc toàn bộ vốn đầu tư</strong>. Kết quả quá khứ không đảm bảo cho tương lai. Mọi quyết định cần dựa trên tình hình tài chính, mức chấp nhận rủi ro và mục tiêu của bạn.
            </>
        ),
    },
    {
        title: "Độ chính xác của Thông tin",
        icon: RefreshCw,
        content: (
            <>
                Mặc dù chúng tôi nỗ lực đảm bảo tính chính xác của thông tin, chúng tôi <strong className="text-white">không cam kết</strong> rằng mọi nội dung đều hoàn toàn chính xác, đầy đủ hay cập nhật. Các nhận định phản ánh đánh giá nghiên cứu tại thời điểm viết và có thể thay đổi không báo trước.
            </>
        ),
    },
    {
        title: "Không liên kết Doanh nghiệp",
        icon: Search,
        content: (
            <>
                Việc phân tích bất kỳ doanh nghiệp nào trên website không có nghĩa là chúng tôi có liên kết, hợp tác, tài trợ hay đại diện cho doanh nghiệp đó dưới bất kỳ hình thức nào.
            </>
        ),
    },
    {
        title: "Tự chịu Trách nhiệm",
        icon: Award,
        content: (
            <>
                Bạn hoàn toàn tự chịu trách nhiệm về mọi quyết định đầu tư của mình. Chúng tôi <strong className="text-white">không chịu trách nhiệm</strong> về bất kỳ tổn thất tài chính nào phát sinh trực tiếp hoặc gián tiếp từ việc sử dụng thông tin trên website này.
            </>
        ),
    },
    {
        title: "Không thu thập giao dịch",
        icon: Database,
        content: (
            <>
                Website không thu thập thông tin về danh mục đầu tư hay giao dịch của bạn. Mọi ghi chú (notes/highlights) đều được lưu trữ cục bộ trên trình duyệt của bạn (<strong className="text-white">localStorage</strong>) và không được gửi về máy chủ.
            </>
        ),
    },
    {
        title: "Dữ liệu đặt lịch & Quyền riêng tư",
        icon: ShieldAlert,
        content: (
            <>
                Họ tên, email, số điện thoại và lời nhắn bạn cung cấp khi đặt lịch chỉ được dùng để xử lý yêu cầu, để quản trị viên xác nhận hoặc đề xuất thời gian khác. Thông tin này không được dùng cho marketing nếu chưa có sự đồng ý của bạn.
            </>
        ),
    },
]

export default function DisclaimerPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* HERO SECTION (Light/Dark Dynamic Theme with Serene Background) */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-background">
                {/* Serene misty grass background - Light Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-multiply pointer-events-none dark:hidden"
                    style={{ backgroundImage: "url('/images/misty_hero_bg.png')" }}
                />

                {/* Serene misty grass background - Dark Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none hidden dark:block"
                    style={{ backgroundImage: "url('/images/misty_hero_bg_dark.png')" }}
                />

                {/* Gradient overlay to transition smoothly into the dark section below */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-[#090d16] pointer-events-none" />

                <div className="container relative z-10 max-w-4xl text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Miễn trừ <span className="text-[#e61c5c] italic font-medium">Trách nhiệm</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Vui lòng đọc kỹ các điều khoản sau trước khi tham khảo nội dung từ website của chúng tôi.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Glassmorphic Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-16">
                    {/* Clauses Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {disclaimerClauses.map((clause, idx) => {
                            const Icon = clause.icon
                            return (
                                <div
                                    key={idx}
                                    className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md flex flex-col space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-lg font-serif font-bold text-white">
                                            {idx + 1}. {clause.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                        {clause.content}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer Info Box */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <div className="flex flex-col space-y-2 text-sm text-[#a0a5b5] font-sans">
                            <p>
                                <strong className="text-white">Ngày có hiệu lực:</strong> 01/01/2024
                            </p>
                            <p>
                                <strong className="text-white">Cập nhật lần cuối:</strong> 13/08/2026
                            </p>
                            <p className="mt-4 pt-4 border-t border-white/[0.06] text-xs">
                                Nếu có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ qua trang{" "}
                                <a href="/about" className="text-[#e61c5c] hover:text-[#e61c5c]/80 underline transition-colors">
                                    Giới thiệu
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
