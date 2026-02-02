import { Check, X, Clock, MessageCircle, FileSearch, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
    title: "Tư vấn & Đồng hành – Athena Stock",
    description: "Đồng hành trong hành trình đầu tư dài hạn. Không bán kèo, không hứa lợi nhuận, không áp lực.",
}

export default function AdvisoryPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <Image
                        src="/logo.png"
                        alt="Athena Stock"
                        width={80}
                        height={80}
                        className="mx-auto mb-8"
                    />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                        Tư vấn & Đồng hành
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Nếu bạn cần người đồng hành để trao đổi nghiêm túc về đầu tư dài hạn —
                        không phải để xin mã, mà để hiểu cách tư duy.
                    </p>
                </div>
            </section>

            {/* Clear Statement */}
            <section className="py-12 border-b">
                <div className="container max-w-3xl">
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 md:p-8">
                        <p className="text-lg font-medium text-primary mb-3">
                            Tuyên bố rõ ràng
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Đây <strong className="text-foreground">không phải</strong> dịch vụ bán "kèo" hay khuyến nghị mua bán cổ phiếu.
                            Chúng tôi cung cấp góc nhìn, kinh nghiệm, và đồng hành trong hành trình đầu tư dài hạn của bạn.
                        </p>
                    </div>
                </div>
            </section>

            {/* What I Don't Do / What I Do */}
            <section className="py-16 md:py-20">
                <div className="container max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* What I DON'T Do */}
                        <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-8">
                            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <X className="w-5 h-5 text-red-600" />
                                </span>
                                Chúng tôi KHÔNG giúp bạn
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "Tìm mã nào nên mua ngay",
                                    "Đạt lợi nhuận X% trong Y tháng",
                                    "Timing thị trường",
                                    "Giao dịch thường xuyên hơn",
                                    "Cam kết hay hứa hẹn kết quả"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                        <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* What I CAN Do */}
                        <div className="bg-green-50/50 dark:bg-green-950/20 rounded-2xl p-8">
                            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </span>
                                Chúng tôi có thể giúp bạn
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "Xây dựng khung tư duy đầu tư dài hạn",
                                    "Review lại danh mục hiện tại (góc nhìn định tính)",
                                    "Nhận diện thiên kiến tâm lý đang ảnh hưởng quyết định",
                                    "Phân tích mô hình kinh doanh doanh nghiệp",
                                    "Đồng hành trong các giai đoạn thị trường khó khăn"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who This Is For */}
            <section className="py-16 md:py-20 bg-secondary/30">
                <div className="container max-w-5xl">
                    <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
                        Ai phù hợp đồng hành cùng chúng tôi?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Who IS for */}
                        <div className="bg-background rounded-2xl p-8 border">
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-6">
                                Phù hợp
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Nhà đầu tư cá nhân muốn chuyển từ 'lướt sóng' sang dài hạn",
                                    "Người đang cảm thấy bất an với quyết định đầu tư của mình",
                                    "Người muốn có một góc nhìn độc lập, không bán hàng",
                                    "Người sẵn sàng học cách tư duy thay vì nhận 'đáp án'"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Who is NOT for */}
                        <div className="bg-background rounded-2xl p-8 border">
                            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6">
                                Không phù hợp
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Người tìm kiếm lợi nhuận nhanh",
                                    "Người muốn có 'đáp án' thay vì học cách tư duy",
                                    "Người kỳ vọng cam kết lợi nhuận cụ thể",
                                    "Người muốn được chỉ mã mua/bán"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                        <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Types */}
            <section className="py-16 md:py-20">
                <div className="container max-w-5xl">
                    <h2 className="text-3xl font-serif font-bold text-primary text-center mb-4">
                        Hình thức tư vấn
                    </h2>
                    <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                        Không có package "VIP" hay upsell. Chọn hình thức phù hợp với nhu cầu của bạn.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Service 1 */}
                        <div className="border rounded-2xl p-6 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <MessageCircle className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Buổi trao đổi đầu tiên</h3>
                            <p className="text-sm text-muted-foreground mb-4">60 phút</p>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Miễn phí, không cam kết — để xem chúng ta có phù hợp làm việc cùng nhau không.
                            </p>
                            <p className="text-accent font-medium">Miễn phí</p>
                        </div>

                        {/* Service 2 */}
                        <div className="border rounded-2xl p-6 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Đồng hành định kỳ</h3>
                            <p className="text-sm text-muted-foreground mb-4">Hàng tháng</p>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Trao đổi hàng tháng về triết lý, mindset, và các quyết định đầu tư.
                            </p>
                            <p className="text-muted-foreground text-sm">Liên hệ để trao đổi</p>
                        </div>

                        {/* Service 3 */}
                        <div className="border rounded-2xl p-6 hover:border-accent/40 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                <FileSearch className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Review danh mục</h3>
                            <p className="text-sm text-muted-foreground mb-4">Một lần</p>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Deep-dive vào danh mục hiện tại từ góc độ định tính và tư duy dài hạn.
                            </p>
                            <p className="text-muted-foreground text-sm">Liên hệ để trao đổi</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section className="py-16 md:py-20 bg-secondary/30">
                <div className="container max-w-4xl">
                    <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">
                        Quy trình làm việc
                    </h2>

                    <div className="space-y-0">
                        {[
                            {
                                step: 1,
                                title: "Trao đổi đầu tiên",
                                duration: "60 phút, miễn phí",
                                description: "Hiểu mục tiêu, kỳ vọng, và đánh giá xem chúng ta có fit để làm việc cùng nhau không."
                            },
                            {
                                step: 2,
                                title: "Đề xuất hình thức phù hợp",
                                duration: "Không áp lực",
                                description: "Bạn hoàn toàn tự quyết định có muốn tiếp tục hay không. Không có follow-up email hay sale call."
                            },
                            {
                                step: 3,
                                title: "Bắt đầu làm việc",
                                duration: "Theo thỏa thuận",
                                description: "Trao đổi thẳng thắn, không màu mè. Chúng tôi sẽ nói rõ những gì chúng tôi biết và không biết."
                            },
                            {
                                step: 4,
                                title: "Đánh giá định kỳ",
                                duration: "Linh hoạt",
                                description: "Điều chỉnh nếu cần. Mục tiêu là bạn tự tin hơn với quyết định của mình, không phải phụ thuộc vào chúng tôi."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative flex gap-6">
                                {/* Timeline line */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                                        {item.step}
                                    </div>
                                    {idx < 3 && (
                                        <div className="w-0.5 h-full bg-border min-h-[60px]" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className="pb-8">
                                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-accent mb-2">{item.duration}</p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <div className="container max-w-3xl text-center">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                        Sẵn sàng trao đổi?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Nếu bạn thấy phù hợp với cách chúng tôi làm việc, chúng ta có thể bắt đầu bằng một buổi trao đổi không cam kết.
                    </p>
                    <a
                        href="mailto:contact@athenastock.vn?subject=Đặt lịch trao đổi"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-md border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        <Clock className="w-5 h-5" />
                        Đặt lịch trao đổi đầu tiên (không cam kết)
                    </a>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-12 bg-muted/50">
                <div className="container max-w-3xl">
                    <div className="border rounded-lg p-6 bg-background">
                        <h3 className="font-bold text-primary mb-4">
                            Miễn trừ trách nhiệm
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                            <p>
                                <strong>Không phải tư vấn đầu tư chuyên nghiệp:</strong> Nội dung trao đổi mang tính chất chia sẻ kinh nghiệm và góc nhìn cá nhân, không phải tư vấn đầu tư theo quy định pháp luật.
                            </p>
                            <p>
                                <strong>Không đảm bảo lợi nhuận:</strong> Mọi quyết định đầu tư đều có rủi ro. Chúng tôi không cam kết hay hứa hẹn bất kỳ kết quả tài chính cụ thể nào.
                            </p>
                            <p>
                                <strong>Tự chịu trách nhiệm:</strong> Bạn hoàn toàn tự chịu trách nhiệm về mọi quyết định đầu tư của mình.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <Link href="/disclaimer" className="text-sm text-accent hover:text-accent/80 transition-colors">
                                Đọc đầy đủ Miễn trừ trách nhiệm →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
