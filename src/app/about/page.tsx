import Link from "next/link"
import Image from "next/image"
import { Check, X, ShieldAlert } from "lucide-react"

export const metadata = {
    title: "Về chúng tôi & Triết lý – Athena Stock",
    description: "Người dẫn đường đầu tư tỉnh thức. Không hứa lợi nhuận, không bán kèo, không cổ vũ giao dịch.",
}

export default function AboutPage() {
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
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={110}
                            height={110}
                            className="h-24 w-auto drop-shadow-2xl hover:scale-95 transition-transform duration-500"
                        />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Về chúng tôi & <span className="text-[#e61c5c] italic font-medium">Triết lý</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Những nhà đầu tư cá nhân, không phải guru.<br />
                        Chia sẻ kinh nghiệm thực chiến, không bán hy vọng làm giàu nhanh.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Glassmorphic Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-24">
                    {/* Mission / Context */}
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                            Tại sao chúng tôi <span className="font-serif italic font-light text-[#e61c5c]">làm website này?</span>
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-6 text-[#a0a5b5] text-sm md:text-base leading-relaxed font-sans text-justify md:text-center">
                            <p>
                                Chúng tôi từng là những người giao dịch nhiều. Mỗi ngày mở ứng dụng chứng khoán hàng chục lần, theo dõi từng biến động giá, lo lắng khi thị trường đỏ lửa và hưng phấn khi bảng điện xanh rì. 
                                Cuối cùng, chúng tôi nhận ra: <strong className="text-white font-medium">kẻ thù lớn nhất của nhà đầu tư không phải là thị trường, mà là chính mình</strong>.
                            </p>
                            <p>
                                Website này ra đời như một cuốn nhật ký hành trình ghi lại sự chuyển hóa của bản thân — từ những người cố gắng "lướt sóng" ngắn hạn sang việc rèn luyện tư duy thực thụ của một người đồng sở hữu doanh nghiệp dài hạn.
                            </p>
                        </div>
                    </div>

                    {/* Investment Philosophy */}
                    <div className="space-y-10">
                        <h2 className="text-2xl md:text-3xl font-sans font-bold text-white text-center">
                            Triết lý <span className="font-serif italic font-light text-[#4271b3]">đầu tư cốt lõi</span>
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Sở hữu doanh nghiệp", desc: "Mua cổ phiếu là mua một phần quyền sở hữu của một doanh nghiệp đang hoạt động, không phải một mẩu giấy để đầu cơ." },
                                { title: "Giá cả vs Giá trị", desc: "Thị trường quyết định giá cả mỗi giây, nhưng chính nội tại và triển vọng kinh doanh mới quyết định giá trị thật của doanh nghiệp." },
                                { title: "Biên an toàn (Margin of Safety)", desc: "Luôn mua dưới giá trị thực để tạo biên phòng vệ trước các biến động không lường trước và những sai số trong định giá." },
                                { title: "Mô hình kinh doanh", desc: "Hiểu sâu sắc về cách doanh nghiệp tạo ra tiền và lợi thế cạnh tranh bền vững của họ hơn là cố gắng dự báo giá ngày mai." }
                            ].map((item, idx) => (
                                <div key={idx} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md">
                                    <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Do vs Don't Bento Grid */}
                    <div className="grid md:grid-cols-2 gap-8 pt-8">
                        {/* What we DON'T do */}
                        <div className="group relative overflow-hidden rounded-3xl border border-red-500/10 bg-red-950/[0.03] backdrop-blur-md p-8 flex flex-col justify-between">
                            <div>
                                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                                    <X className="h-6 w-6" />
                                </div>
                                <h3 className="mb-6 text-xl font-bold font-serif text-white">Chúng tôi KHÔNG làm</h3>
                                <ul className="space-y-4 text-[#a0a5b5] text-sm font-sans">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Khuyến nghị mua/bán các mã cổ phiếu cụ thể.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Hứa hẹn lợi nhuận hấp dẫn hay cam kết giá.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Bán kèo, tín hiệu giao dịch, hay các lớp làm giàu nhanh.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Khuyến khích giao dịch liên tục kiếm phí hoa hồng.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* What we CAN do */}
                        <div className="group relative overflow-hidden rounded-3xl border border-green-500/10 bg-green-950/[0.03] backdrop-blur-md p-8 flex flex-col justify-between">
                            <div>
                                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20">
                                    <Check className="h-6 w-6" />
                                </div>
                                <h3 className="mb-6 text-xl font-bold font-serif text-white">Chúng tôi có thể giúp</h3>
                                <ul className="space-y-4 text-[#a0a5b5] text-sm font-sans">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Phân tích định tính sâu sắc mô hình kinh doanh doanh nghiệp.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Giúp nhận diện các thiên kiến tâm lý làm hại túi tiền bạn.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Xây dựng một quy trình checklist phân tích có kỷ luật.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Lắng nghe và thảo luận khách quan về tư duy dài hạn.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Talk to us Quote Box */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <h3 className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-white mb-6">
                            &quot;Nếu bạn cần một người đồng hành thực thụ trong hành trình đầu tư dài hạn — không phải xin mã, mà để mài sắc tư duy.&quot;
                        </h3>
                        <div className="flex justify-center mt-6">
                            <Link
                                href="/advisory"
                                className="h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold flex items-center justify-center transition-all shadow-md active:scale-[0.97]"
                            >
                                Tìm hiểu về Tư vấn & Đồng hành
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer Footer Link */}
                    <div className="pt-6 border-t border-white/[0.06] text-center">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 font-sans">
                            <ShieldAlert className="w-4 h-4 text-accent" />
                            Vui lòng xem kỹ thông tin{" "}
                            <Link href="/disclaimer" className="underline text-white hover:text-[#e61c5c] transition-colors">
                                Miễn trừ trách nhiệm
                            </Link>{" "}
                            trước khi xem các bài phân tích.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
