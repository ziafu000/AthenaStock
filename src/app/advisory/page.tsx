import { Check, X, Clock, MessageCircle, FileSearch, Users, ShieldAlert, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
    title: "Tư vấn & Đồng hành – Athena Stock",
    description: "Đồng hành giáo dục để xây dựng quy trình ra quyết định đầu tư độc lập, có nguyên tắc và dựa trên bằng chứng.",
}

export default function AdvisoryPage() {
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
                        Tư vấn & <span className="text-[#e61c5c] italic font-medium">Đồng hành</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Đồng hành giáo dục để bạn xây dựng quy trình ra quyết định độc lập, có nguyên tắc và dựa trên bằng chứng.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-24">
                    
                    {/* Clear Statement Box */}
                    <div className="relative border border-red-500/20 bg-red-950/[0.04] rounded-3xl p-6 md:p-8 backdrop-blur-md">
                        <p className="text-lg font-serif font-bold text-[#e61c5c] mb-2">Tuyên bố rõ ràng</p>
                        <p className="text-[#a0a5b5] text-sm md:text-base leading-relaxed font-sans">
                            Đây là hoạt động giáo dục và đồng hành tư duy, không phải quản lý tài sản, quyết định thay bạn, tư vấn mua bán cá nhân hay cam kết kết quả đầu tư.
                        </p>
                    </div>

                    {/* Do vs Don't Lists */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* What we DON'T do */}
                        <div className="group relative overflow-hidden rounded-3xl border border-red-500/10 bg-red-950/[0.03] backdrop-blur-md p-8">
                            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                                <X className="h-6 w-6" />
                            </div>
                            <h3 className="mb-6 text-xl font-bold font-serif text-white">Chúng tôi KHÔNG giúp bạn</h3>
                            <ul className="space-y-4 text-[#a0a5b5] text-sm font-sans">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold shrink-0">✕</span>
                                    <span>Quyết định mã chứng khoán hoặc thời điểm giao dịch thay bạn.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold shrink-0">✕</span>
                                    <span>Cam kết mức sinh lời hoặc bảo đảm kết quả đầu tư.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold shrink-0">✕</span>
                                    <span>Dự báo chắc chắn diễn biến thị trường ngắn hạn.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold shrink-0">✕</span>
                                    <span>Quản lý tài sản hoặc thực hiện giao dịch trên tài khoản của bạn.</span>
                                </li>
                            </ul>
                        </div>

                        {/* What we CAN do */}
                        <div className="group relative overflow-hidden rounded-3xl border border-green-500/10 bg-green-950/[0.03] backdrop-blur-md p-8">
                            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20">
                                <Check className="h-6 w-6" />
                            </div>
                            <h3 className="mb-6 text-xl font-bold font-serif text-white">Chúng tôi có thể giúp bạn</h3>
                            <ul className="space-y-4 text-[#a0a5b5] text-sm font-sans">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 font-bold shrink-0">✓</span>
                                    <span>Định hình phương pháp đầu tư giá trị có nguyên tắc.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 font-bold shrink-0">✓</span>
                                    <span>Thực hành quy trình ra quyết định qua các tình huống nghiên cứu.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 font-bold shrink-0">✓</span>
                                    <span>Nhận diện thiên kiến và phản ứng cảm xúc trong đầu tư.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 font-bold shrink-0">✓</span>
                                    <span>Xây dựng checklist để tự đánh giá chất lượng quyết định.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Who it fits */}
                    <div className="space-y-10">
                        <h2 className="text-2xl md:text-3xl font-sans font-bold text-white text-center">
                            Ai phù hợp với <span className="font-serif italic font-light text-[#e61c5c]">Athena Stock?</span>
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8">
                                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-400" /> Phù hợp
                                </h3>
                                <ul className="space-y-3 text-sm text-[#a0a5b5] font-sans">
                                    <li>• Muốn xây dựng phương pháp đầu tư dài hạn có nguyên tắc.</li>
                                    <li>• Sẵn sàng kiểm chứng giả định bằng dữ liệu và bằng chứng.</li>
                                    <li>• Muốn phát triển năng lực tự tư duy và tự chịu trách nhiệm.</li>
                                </ul>
                            </div>

                            <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8">
                                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                                    <X className="w-5 h-5 text-red-400" /> Không phù hợp
                                </h3>
                                <ul className="space-y-3 text-sm text-[#a0a5b5] font-sans">
                                    <li>• Tìm kiếm đáp án mua bán cụ thể hoặc kết quả nhanh.</li>
                                    <li>• Muốn người khác ra quyết định thay mà không cần tự phân tích.</li>
                                    <li>• Mong đợi cam kết lợi nhuận hoặc bảo đảm không thua lỗ.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Service Types */}
                    <div className="space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                                Hình thức <span className="font-serif italic font-light text-[#4271b3]">đồng hành</span>
                            </h2>
                            <p className="text-[#a0a5b5] text-xs md:text-sm font-sans">Chúng tôi chỉ tập trung vào hiệu quả và sự phù hợp dài hạn.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: MessageCircle, title: "Trao đổi ban đầu", desc: "60 phút để hiểu bối cảnh, mục tiêu học tập và mức độ phù hợp của hai bên.", fee: "Miễn phí (Không cam kết)" },
                                { icon: Users, title: "Đồng hành định kỳ", desc: "Trao đổi hàng tháng để rà lại quy trình, giả định và chất lượng tư duy ra quyết định.", fee: "Liên hệ thỏa thuận" },
                                { icon: FileSearch, title: "Phân tích tình huống", desc: "Thực hành trên case study doanh nghiệp và framework; không đưa khuyến nghị mua bán cá nhân.", fee: "Liên hệ thỏa thuận" }
                            ].map((item, idx) => {
                                const Icon = item.icon
                                return (
                                    <div key={idx} className="border border-white/[0.06] bg-white/[0.01] hover:border-[#4271b3]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
                                        <div>
                                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] text-[#4271b3] border border-white/[0.08] flex items-center justify-center mb-4">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                            <p className="text-xs text-[#a0a5b5] leading-relaxed mb-6 font-sans">{item.desc}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-[#e61c5c] font-sans">{item.fee}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Workflow Process */}
                    <div className="space-y-10">
                        <h2 className="text-2xl md:text-3xl font-sans font-bold text-white text-center">
                            Quy trình <span className="font-serif italic font-light text-[#e61c5c]">kết nối</span>
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: "01", title: "Kết nối & Lắng nghe", desc: "Buổi gặp trực tuyến đầu tiên để hiểu bối cảnh và mục tiêu học tập của bạn." },
                                { step: "02", title: "Đánh giá mức độ phù hợp", desc: "Hai bên cùng xác định liệu cách đồng hành này có phù hợp để tiếp tục hay không." },
                                { step: "03", title: "Thống nhất & Thực hiện", desc: "Bắt đầu nhịp trao đổi hàng tháng với mục tiêu và phạm vi rõ ràng." },
                                { step: "04", title: "Tự chủ hành trình", desc: "Hướng đến khả năng tự nghiên cứu, tự ra quyết định và tự chịu trách nhiệm." }
                            ].map((item, idx) => (
                                <div key={idx} className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-6 relative">
                                    <span className="absolute top-4 right-6 text-4xl font-serif font-black text-white/[0.03]">{item.step}</span>
                                    <h3 className="text-base font-bold mb-2 font-serif text-white">{item.title}</h3>
                                    <p className="text-xs text-[#a0a5b5] leading-relaxed font-sans">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Email Box */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <h3 className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-white mb-6">
                            Sẵn sàng trao đổi cùng chúng tôi?
                        </h3>
                        <p className="text-sm text-[#a0a5b5] max-w-md mx-auto mb-8 font-sans">
                            Nếu phong cách đầu tư bền bỉ này phù hợp với triết lý sống của bạn, chúng ta có thể đặt lịch cho buổi nói chuyện đầu tiên.
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href="?booking=open"
                                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold transition-all shadow-md active:scale-[0.97]"
                            >
                                <Clock className="w-4 h-4" />
                                Đặt lịch buổi hẹn đầu tiên (Miễn phí)
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer Box */}
                    <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8 space-y-4">
                        <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-accent" /> Miễn trừ trách nhiệm quan trọng
                        </h3>
                        <div className="text-xs text-[#a0a5b5] space-y-2 leading-relaxed font-sans">
                            <p><strong>• Phạm vi giáo dục:</strong> Mọi trao đổi nhằm phát triển tư duy và năng lực nghiên cứu, không phải tư vấn tài chính, pháp lý hay khuyến nghị mua bán dành cho cá nhân.</p>
                            <p><strong>• Rủi ro vốn có:</strong> Đầu tư luôn có rủi ro. Athena Stock không cam kết, hứa hẹn hay bảo lãnh bất kỳ kết quả hoặc tỷ suất sinh lời nào.</p>
                            <p><strong>• Quyết định tự chủ:</strong> Bạn tự chịu trách nhiệm về tài sản và mọi quyết định trên tài khoản cá nhân; Athena Stock không quản lý hoặc giao dịch thay bạn.</p>
                        </div>
                        <div className="pt-4 border-t border-white/[0.04]">
                            <Link href="/disclaimer" className="text-xs text-accent hover:underline flex items-center gap-1">
                                Đọc bản miễn trừ trách nhiệm đầy đủ <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
