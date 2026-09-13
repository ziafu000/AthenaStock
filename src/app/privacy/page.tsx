import Link from "next/link"
import { Shield, Lock, Database, Server, RefreshCw, Mail, CheckCircle2 } from "lucide-react"

export const metadata = {
    title: "Chính sách quyền riêng tư – Athena Stock",
    description: "Chính sách bảo mật dữ liệu, minh bạch về việc thu thập và xử lý thông tin tại Athena Stock.",
}

const privacySections = [
    {
        title: "Dữ liệu thu thập qua Booking form",
        icon: Mail,
        content: (
            <div className="space-y-3">
                <p>
                    Khi bạn gửi yêu cầu đặt lịch hẹn hoặc tư vấn trên Athena Stock, chúng tôi thu thập các thông tin sau:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-1 text-[#d1d5db]">
                    <li>Họ và tên</li>
                    <li>Địa chỉ email</li>
                    <li>Số điện thoại</li>
                    <li>Ngày và giờ mong muốn trao đổi</li>
                    <li>Nội dung lời nhắn hoặc chủ đề quan tâm</li>
                </ul>
                <p className="text-sm text-[#a0a5b5] pt-1">
                    <strong className="text-white">Mục đích sử dụng:</strong> Thông tin chỉ được dùng duy nhất để quản trị viên liên hệ xác nhận lịch, sắp xếp trao đổi 1-1 hoặc đề xuất lịch hẹn phù hợp. Chúng tôi tuyệt đối không sử dụng thông tin này cho mục đích tiếp thị, quảng cáo hay bán lại cho bên thứ ba.
                </p>
            </div>
        ),
    },
    {
        title: "Đăng ký nhận bản tin",
        icon: Mail,
        content: (
            <div className="space-y-3">
                <p>
                    Khi bạn đăng ký nhận bản tin, chúng tôi thu thập địa chỉ email để quản lý đăng ký và gửi email chào mừng, bản tin cùng các thông báo liên quan.
                </p>
                <p className="text-sm text-[#a0a5b5]">
                    Địa chỉ email và trạng thái đăng ký được lưu trong cơ sở dữ liệu PostgreSQL bảo mật của Athena Stock, kết nối qua cấu hình máy chủ <strong className="text-white">DATABASE_URL</strong>. Mỗi email bản tin có liên kết hủy đăng ký; khi bạn hủy, hệ thống ngừng gửi bản tin và ghi nhận trạng thái hủy đăng ký.
                </p>
            </div>
        ),
    },
    {
        title: "Tùy chọn hiển thị trên thiết bị",
        icon: Database,
        content: (
            <div className="space-y-3">
                <p>
                    Website chỉ sử dụng <strong className="text-white">localStorage</strong> trên trình duyệt để ghi nhớ các tùy chọn hiển thị của bạn, như cỡ chữ, độ rộng dòng đọc và giao diện sáng hoặc tối.
                </p>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-[#a0a5b5] space-y-1">
                    <p className="font-semibold text-[#faf8f6]">Cam kết bảo mật thiết bị:</p>
                    <p>Các tùy chọn này không được gửi lên máy chủ của Athena Stock. Bạn có thể xóa chúng bất kỳ lúc nào bằng cách xóa dữ liệu duyệt web trên trình duyệt của mình.</p>
                </div>
            </div>
        ),
    },
    {
        title: "Các bên thứ ba tiếp nhận dữ liệu",
        icon: Server,
        content: (
            <div className="space-y-3">
                <p>
                    Để duy trì trải nghiệm vận hành ổn định và an toàn, website sử dụng một số dịch vụ kỹ thuật tối thiểu từ bên thứ ba:
                </p>
                <div className="space-y-3 text-sm">
                    <div className="border-l-2 border-[#e61c5c]/40 pl-3">
                        <strong className="text-white">Vercel:</strong> Cung cấp hạ tầng lưu trữ (hosting) và giải pháp đo lường truy cập web ẩn danh (Vercel Web Analytics). Vercel không thu thập thông tin nhận dạng cá nhân và tuân thủ các tiêu chuẩn bảo mật dữ liệu khắt khe.
                    </div>
                    <div className="border-l-2 border-[#4271b3]/40 pl-3">
                        <strong className="text-white">Cloudflare Turnstile:</strong> Cơ chế chống bot và thư rác (spam) trong biểu mẫu đặt lịch hẹn. Giải pháp này bảo vệ an toàn website mà không thu thập dữ liệu theo dõi người dùng xuyên suốt các website khác.
                    </div>
                    <div className="border-l-2 border-emerald-400/40 pl-3">
                        <strong className="text-white">Resend:</strong> Cung cấp dịch vụ chuyển phát email xác nhận đặt lịch, email quản trị và email liên quan đến đăng ký bản tin. Resend nhận địa chỉ email người nhận cùng nội dung cần thiết để chuyển phát các email này.
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: "Lưu trữ & xóa dữ liệu",
        icon: Database,
        content: (
            <div className="space-y-3">
                <p>
                    <strong className="text-white">Nơi lưu trữ:</strong> Dữ liệu đặt lịch và đăng ký bản tin được lưu trong cơ sở dữ liệu PostgreSQL bảo mật, kết nối qua cấu hình máy chủ <strong className="text-white">DATABASE_URL</strong>.
                </p>
                <p className="text-sm text-[#a0a5b5]">
                    <strong className="text-white">Thời gian lưu trữ & quyền xóa dữ liệu:</strong> Thời hạn lưu trữ cụ thể và quy trình xóa tự động đang được hoàn thiện. Trong thời gian này, bạn có thể yêu cầu tra cứu, chỉnh sửa hoặc xóa dữ liệu thủ công bất cứ lúc nào qua email <a href="mailto:contact@athenastock.com" className="text-[#e61c5c] underline hover:text-[#e61c5c]/80">contact@athenastock.com</a>; Athena Stock sẽ tiếp nhận và thực hiện yêu cầu xóa.
                </p>
            </div>
        ),
    },
]

export default function PrivacyPage() {
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
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Chính sách <span className="text-[#e61c5c] italic font-medium">Quyền riêng tư</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Minh bạch, tôn trọng quyền riêng tư và cam kết bảo vệ dữ liệu cá nhân của người đọc.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Glassmorphic Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-16">
                    {/* Introduction Summary */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md space-y-4">
                        <div className="flex items-center gap-3 text-[#e61c5c]">
                            <Shield className="h-6 w-6" />
                            <h2 className="text-xl font-serif font-bold text-white">Cam kết quyền riêng tư tại Athena Stock</h2>
                        </div>
                        <p className="text-sm md:text-base text-[#a0a5b5] leading-relaxed font-sans">
                            Athena Stock hoạt động theo nguyên tắc tôn trọng quyền riêng tư và tối thiểu hóa dữ liệu (data minimization). Chúng tôi chỉ thu thập các thông tin thực sự cần thiết để trao đổi hoặc phản hồi yêu cầu của bạn, và luôn minh bạch về cách dữ liệu được xử lý.
                        </p>
                    </div>

                    {/* Privacy Sections Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {privacySections.map((section, idx) => {
                            const Icon = section.icon
                            return (
                                <div
                                    key={idx}
                                    className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md flex flex-col space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20 shrink-0">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-serif font-bold text-white leading-snug">
                                            {idx + 1}. {section.title}
                                        </h3>
                                    </div>
                                    <div className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                        {section.content}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Rights & Contact Card */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md max-w-2xl mx-auto space-y-4">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-400/80" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white">Quyền lợi của bạn</h3>
                        <p className="text-sm text-[#a0a5b5] font-sans leading-relaxed">
                            Bạn có toàn quyền yêu cầu xem lại, điều chỉnh hoặc hủy bỏ bất kỳ thông tin nào bạn đã cung cấp cho chúng tôi. Mọi thắc mắc về quyền riêng tư, vui lòng gửi email về:
                        </p>
                        <div>
                            <a
                                href="mailto:contact@athenastock.com"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#9c1850] hover:bg-[#861244] px-6 py-2.5 rounded-full transition-colors shadow-sm"
                            >
                                <Mail className="w-4 h-4" />
                                contact@athenastock.com
                            </a>
                        </div>
                        <div className="pt-4 border-t border-white/[0.06] text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
                            <span>Có hiệu lực từ: 13/09/2026</span>
                            <span className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Cập nhật lần cuối: 13/09/2026
                            </span>
                        </div>
                    </div>

                    {/* Disclaimer Navigation Link */}
                    <div className="pt-6 border-t border-white/[0.06] text-center">
                        <p className="text-xs text-muted-foreground font-sans">
                            Xem thêm thông tin tại trang{" "}
                            <Link href="/disclaimer" className="underline text-white hover:text-[#e61c5c] transition-colors">
                                Miễn trừ trách nhiệm
                            </Link>{" "}
                            và trang{" "}
                            <Link href="/about" className="underline text-white hover:text-[#e61c5c] transition-colors">
                                Về chúng tôi & Triết lý
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
