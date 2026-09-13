import Link from "next/link"
import Image from "next/image"
import {
    Check,
    X,
    ShieldAlert,
    Database,
    Layers,
    FileCheck,
    History,
    Scale,
    Compass,
} from "lucide-react"

export const metadata = {
    title: "Về Athena Stock – Investment Thinking House",
    description: "Athena Stock là Investment Thinking House: Đầu tư như một người chủ doanh nghiệp: hiểu doanh nghiệp, hiểu chính mình và xây dựng tài sản bền vững.",
}

const researchSteps = [
    {
        num: "01",
        title: "Bối cảnh vĩ mô",
        desc: "Đánh giá chu kỳ kinh tế, chính sách tiền tệ, tỷ giá, lạm phát và bối cảnh vĩ mô trong nước lẫn quốc tế tác động đến thị trường.",
        tag: "Vĩ mô & Ngành",
    },
    {
        num: "02",
        title: "So sánh các ngành có lợi thế / triển vọng",
        desc: "Sàng lọc và đối chiếu tiềm năng tăng trưởng giữa các nhóm ngành; xác định các ngành đang ở chân sóng phục hồi hoặc hưởng lợi chu kỳ dài hạn.",
        tag: "Vĩ mô & Ngành",
    },
    {
        num: "03",
        title: "Lựa chọn 1–3 doanh nghiệp nổi bật",
        desc: "Khoanh vùng 1 đến 3 doanh nghiệp đầu ngành hoặc có lợi thế cạnh tranh bền vững (economic moat) vượt trội so với phần còn lại.",
        tag: "Vĩ mô & Ngành",
    },
    {
        num: "04",
        title: "Đánh giá quy mô và tăng trưởng",
        desc: "Đo lường quy mô vốn hóa, doanh thu thuần, lợi nhuận sau thuế và tốc độ tăng trưởng doanh thu/lợi nhuận qua từng giai đoạn phát triển.",
        tag: "Tài chính & Định lượng",
    },
    {
        num: "05",
        title: "Đánh giá sức khỏe tài chính & hiệu quả",
        desc: "Kiểm tra sâu các chỉ số cốt lõi: ROE, ROA, biên lợi nhuận gộp/ròng, định giá P/E, P/B, P/S, cơ cấu nợ vay, dòng tiền (CFO, FCF) và chỉ số đặc thù ngành.",
        tag: "Tài chính & Định lượng",
    },
    {
        num: "06",
        title: "So sánh chu kỳ: QoQ, YoY và CAGR 3 năm",
        desc: "Bóc tách gia tốc tăng trưởng từng quý (QoQ), so sánh cùng kỳ (YoY) và tính toán tốc độ tăng trưởng kép hàng năm (CAGR 3 năm) để loại bỏ yếu tố thời vụ.",
        tag: "Tài chính & Định lượng",
    },
    {
        num: "07",
        title: "Mở rộng góc nhìn toàn diện & đa chiều",
        desc: "Mở rộng chu kỳ phân tích 5 năm, so sánh với trung bình ngành và Top 1–3 đối thủ, cập nhật dự phóng từ các tổ chức nghiên cứu uy tín, lịch sử định giá và bóc tách từng mảng kinh doanh.",
        tag: "Tài chính & Định lượng",
    },
    {
        num: "08",
        title: "Đối chiếu dữ liệu đa nguồn",
        desc: "Kiểm chứng chéo thông tin trực tiếp từ Báo cáo tài chính, Báo cáo thường niên, thông cáo IR chính thức, kết hợp các hệ thống dữ liệu chuyên sâu: Simplize, FireAnt, Vietcap IQ / Vietcap Research.",
        tag: "Xác thực & Kỹ thuật",
    },
    {
        num: "09",
        title: "Phân tích kỹ thuật (Technical Analysis)",
        desc: "Phân tích hành vi cung cầu, cấu trúc tích lũy và động lượng thông qua hệ thống công cụ kỹ thuật chọn lọc: đường trung bình (MA), RSI, MACD và dải Bollinger Bands.",
        tag: "Xác thực & Kỹ thuật",
    },
    {
        num: "10",
        title: "Đánh giá xu hướng ngắn / trung / dài hạn",
        desc: "Xác lập bối cảnh xu hướng đa khung thời gian để tìm kiếm điểm giao thoa giữa giá trị nội tại và động lực dòng tiền, từ đó tối ưu điểm vị thế và quản trị rủi ro.",
        tag: "Xác thực & Kỹ thuật",
    },
    {
        num: "11",
        title: "Đưa doanh nghiệp vào Watchlist",
        desc: "Lập hồ sơ theo dõi trọng điểm đối với các doanh nghiệp đạt chuẩn chất lượng cao, kiên nhẫn chờ đợi mức định giá có Biên an toàn (Margin of Safety) hấp dẫn.",
        tag: "Quyết định & Thực thi",
    },
    {
        num: "12",
        title: "Ra quyết định đầu tư phù hợp",
        desc: "Thực hiện giải ngân phân bổ vốn có kỷ luật, định cỡ vị thế (position sizing) phù hợp với chiến lược quản trị rủi ro và từng cấp độ thành viên.",
        tag: "Quyết định & Thực thi",
    },
]

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
                    <p className="mx-auto max-w-2xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Athena Stock là Investment Thinking House.<br />
                        Đầu tư như một người chủ doanh nghiệp: hiểu doanh nghiệp, hiểu chính mình và xây dựng tài sản bền vững.
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
                            Athena Stock <span className="font-serif italic font-light text-[#e61c5c]">là gì?</span>
                        </h2>
                        <div className="max-w-3xl mx-auto space-y-6 text-[#a0a5b5] text-sm md:text-base leading-relaxed font-sans text-justify md:text-center">
                            <p>
                                Athena Stock là <strong className="text-white font-medium">Investment Thinking House</strong> — không gian nghiên cứu và rèn luyện tư duy đầu tư độc lập, nơi phân tích doanh nghiệp dựa trên chứng cứ thực tế, xây dựng framework ra quyết định có hệ thống và nâng cao năng lực tự chủ tâm lý cho nhà đầu tư.
                            </p>
                            <p>
                                North Star kim chỉ nam của chúng tôi là: <strong className="text-white font-medium">“Đầu tư như một người chủ doanh nghiệp: hiểu doanh nghiệp, hiểu chính mình và xây dựng tài sản bền vững.”</strong> Góc nhìn này giúp nhà đầu tư đặt câu hỏi có cấu trúc, thấu hiểu giới hạn của dữ liệu, không chạy theo đám đông và hoàn toàn làm chủ quyết định của chính mình.
                            </p>
                        </div>
                    </div>

                    {/* Investment Philosophy */}
                    <div className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                                Triết lý <span className="font-serif italic font-light text-[#4271b3]">đầu tư cốt lõi</span>
                            </h2>
                            <p className="text-sm text-[#a0a5b5] max-w-xl mx-auto font-sans">
                                Bốn nguyên lý nền tảng định hình cách chúng tôi nhìn nhận thị trường và phân tích mọi tài sản.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Sở hữu doanh nghiệp", desc: "Xem cổ phiếu như quyền sở hữu một phần doanh nghiệp thực sự. Trọng tâm nghiên cứu nằm ở năng lực sinh lời của tài sản và triển vọng kinh doanh lâu dài, không phải biến động giá từng phiên." },
                                { title: "Giá cả và giá trị", desc: "Giá thị trường dao động theo tâm lý số đông ngắn hạn, trong khi giá trị nội tại được neo vào dòng tiền tương lai của doanh nghiệp. Cả hai luôn cần được định lượng cùng giả định cụ thể." },
                                { title: "Biên an toàn (Margin of Safety)", desc: "Biên an toàn là khoảng đệm bắt buộc để phòng ngừa sai số trong định giá, các biến cố bất khả kháng và những bất định tự nhiên của môi trường kinh doanh." },
                                { title: "Mô hình kinh doanh & Moat", desc: "Thấu hiểu nguồn gốc tạo ra dòng tiền, năng lực tái đầu tư vốn và các rào cản hào thành kinh tế (moat) bảo vệ doanh nghiệp trước sự cạnh tranh gay gắt." }
                            ].map((item, idx) => (
                                <div key={idx} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md">
                                    <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 12-Step Enterprise Research Process */}
                    <div className="space-y-10">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e61c5c]/10 text-[#e61c5c] text-xs font-semibold tracking-wide uppercase border border-[#e61c5c]/20">
                                <Layers className="w-3.5 h-3.5" />
                                Quy trình chuẩn mực
                            </div>
                            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                                Quy trình nghiên cứu doanh nghiệp <span className="font-serif italic font-light text-[#e61c5c]">12 bước</span>
                            </h2>
                            <p className="text-sm text-[#a0a5b5] max-w-2xl mx-auto font-sans leading-relaxed">
                                Phương pháp luận phân tích toàn diện kết hợp giữa phân tích vĩ mô, bóc tách cơ bản chuyên sâu, đối chiếu dữ liệu đa nguồn và xác nhận kỹ thuật nhằm bảo đảm tính nhất quán trước khi giải ngân.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {researchSteps.map((step) => (
                                <div
                                    key={step.num}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md hover:border-white/[0.12] transition-colors flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono font-bold text-[#e61c5c] bg-[#e61c5c]/10 px-2 py-0.5 rounded border border-[#e61c5c]/20">
                                                Bước {step.num}
                                            </span>
                                            <span className="text-[11px] font-sans text-muted-foreground uppercase tracking-wider">
                                                {step.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-serif font-bold text-white group-hover:text-[#faf8f6] transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3-Tier Assertion Labeling Standard */}
                    <div className="space-y-10">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4271b3]/10 text-[#4271b3] text-xs font-semibold tracking-wide uppercase border border-[#4271b3]/20">
                                <Scale className="w-3.5 h-3.5" />
                                Chuẩn mực nội dung
                            </div>
                            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                                Tiêu chuẩn phân định nhận định <span className="font-serif italic font-light text-[#4271b3]">3 cấp độ</span>
                            </h2>
                            <p className="text-sm text-[#a0a5b5] max-w-2xl mx-auto font-sans leading-relaxed">
                                Để tránh nhầm lẫn giữa dữ liệu thực tế và quan điểm chủ quan, mọi ấn phẩm nghiên cứu của Athena Stock đều phân tách minh bạch 3 tầng thông tin:
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-sky-950/[0.04] p-6 backdrop-blur-md space-y-3">
                                <div className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                    <Database className="w-3.5 h-3.5" /> DỮ KIỆN (Fact)
                                </div>
                                <h3 className="text-base font-serif font-bold text-white">Số liệu có nguồn kiểm chứng</h3>
                                <p className="text-xs md:text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                    Là thông tin, sự kiện hoặc chỉ số tài chính định lượng được trích xuất trực tiếp từ các văn bản chính thống: Báo cáo tài chính đã kiểm toán, Báo cáo thường niên, Nghị quyết ĐHĐCĐ hoặc thông cáo IR chính thức. Luôn đi kèm trích dẫn nguồn cụ thể.
                                </p>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-950/[0.04] p-6 backdrop-blur-md space-y-3">
                                <div className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <FileCheck className="w-3.5 h-3.5" /> NHẬN ĐỊNH (Inference)
                                </div>
                                <h3 className="text-base font-serif font-bold text-white">Kết luận & góc nhìn phân tích</h3>
                                <p className="text-xs md:text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                    Là các phân tích logic, diễn giải bản chất và kết luận chuyên môn được suy ra từ dữ kiện thực tế. Nhận định phản ánh góc nhìn độc lập của tác giả tại thời điểm nghiên cứu và luôn sẵn sàng đón nhận phản biện khoa học.
                                </p>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-[#e61c5c]/20 bg-[#e61c5c]/[0.02] p-6 backdrop-blur-md space-y-3">
                                <div className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20">
                                    <Compass className="w-3.5 h-3.5" /> GIẢ ĐỊNH (Assumption)
                                </div>
                                <h3 className="text-base font-serif font-bold text-white">Tiền đề mô hình & kịch bản</h3>
                                <p className="text-xs md:text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                    Là các điều kiện giả định dùng để xây dựng mô hình định giá tương lai hoặc dự phóng kịch bản tăng trưởng (tốc độ tăng trưởng dài hạn, chi phí vốn WACC, biên lợi nhuận kỳ vọng). Giả định luôn được nêu rõ để người đọc có thể tự kiểm tra độ nhạy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Update & Correction Policy */}
                    <div className="space-y-8">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide uppercase border border-emerald-500/20">
                                <History className="w-3.5 h-3.5" />
                                Tính chính trực
                            </div>
                            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
                                Chính sách cập nhật & <span className="font-serif italic font-light text-emerald-400">sửa sai minh bạch</span>
                            </h2>
                            <p className="text-sm text-[#a0a5b5] max-w-2xl mx-auto font-sans leading-relaxed">
                                Chúng tôi coi trọng sự trung thực trí tuệ (intellectual honesty) cao hơn việc chứng tỏ mình luôn đúng.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-md space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                        Không sửa âm thầm (No Silent Edits)
                                    </h3>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                        Nguyên tắc biên tập của Athena Stock là không sửa âm thầm. Mọi cập nhật hoặc đính chính nội dung đã công bố đều được ghi nhãn rõ ràng kèm ngày thực hiện.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                        Cập nhật dữ liệu mới (Update)
                                    </h3>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                        Khi bổ sung dữ liệu mới hoặc thay đổi nhận định, nội dung cập nhật được ghi nhãn <strong className="text-white font-medium">Update</strong> kèm ngày thực hiện.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/[0.06]">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                        Đính chính sai sót (Correction Notice)
                                    </h3>
                                    <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                        Khi phát hiện sai sót, phần sửa chữa được ghi nhãn <strong className="text-white font-medium">Correction</strong> kèm ngày thực hiện để người đọc phân biệt với nội dung ban đầu.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Do vs Don't Bento Grid */}
                    <div className="grid md:grid-cols-2 gap-8 pt-4">
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
                                        <span>Đưa ra khuyến nghị mua hoặc bán dành riêng cho từng cá nhân.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Hứa hẹn lợi nhuận, cam kết giá mục tiêu hoặc bảo đảm kết quả đầu tư.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Cung cấp tín hiệu lướt sóng, nhóm VIP phím hàng hoặc nội dung làm giàu nhanh.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <span>Ủy thác quản lý tài sản hoặc ra quyết định thay cho người đọc.</span>
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
                                        <span>Cung cấp nghiên cứu doanh nghiệp có cấu trúc và case study đa ngành thực tế.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Giúp nhận diện và kiểm soát thiên kiến tâm lý ảnh hưởng xấu đến quyết định.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Xây dựng quy trình, checklist và bộ tiêu chí sàng lọc có thể lặp lại nhất quán.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold shrink-0">✓</span>
                                        <span>Đồng hành tư duy dài hạn dựa trên dữ kiện, giả định rõ ràng và kỷ luật thép.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Talk to us Quote Box */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <h3 className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-white mb-6">
                            &quot;Đầu tư như một người chủ doanh nghiệp: hiểu doanh nghiệp, hiểu chính mình và xây dựng tài sản bền vững.&quot;
                        </h3>
                        <div className="flex justify-center mt-6">
                            <Link
                                href="/advisory"
                                className="h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold flex items-center justify-center transition-all shadow-md active:scale-[0.97]"
                            >
                                Tìm hiểu cách đồng hành
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
                            và{" "}
                            <Link href="/privacy" className="underline text-white hover:text-[#e61c5c] transition-colors">
                                Chính sách quyền riêng tư
                            </Link>{" "}
                            trước khi xem các bài phân tích.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
