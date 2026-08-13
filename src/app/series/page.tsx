import Link from "next/link"
import { BookOpen, ArrowRight, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = {
    title: "Series – Athena Stock",
    description: "Lộ trình đọc có hệ thống để xây dựng năng lực tư duy đầu tư từ nền tảng đến chuyên sâu.",
}

const seriesData = [
    {
        title: "Nền tảng Tư duy Đầu tư",
        description: "Bắt đầu từ đây: hiểu sâu sắc triết lý cốt lõi, nhận diện các sai lầm hành vi kinh điển, và nắm vững checklist phân tích mô hình doanh nghiệp.",
        articles: [
            { slug: "/articles/triet-ly-dai-han", title: "Triết lý Đầu tư Dài hạn & Margin of Safety" },
            { slug: "/psychology/sai-lam-hanh-vi", title: "Sai lầm Hành vi: FOMO, Tham-Sợ & Nghiện Giao dịch" },
            { slug: "/frameworks/checklist-phan-tich", title: "Checklist Phân tích Doanh nghiệp" },
        ],
        color: "accent",
    },
    {
        title: "Đọc hiểu Báo cáo Tài chính",
        description: "Loạt bài giúp bạn đọc vị và thấu hiểu những con số khô khan trong báo cáo tài chính một cách đơn giản, thực dụng nhất.",
        articles: [],
        comingSoon: true,
        color: "blue",
    },
    {
        title: "Tâm lý học Đầu tư chuyên sâu",
        description: "Giải mã chuyên sâu các thiên kiến nhận thức phức tạp và xây dựng bộ giáp tâm lý kiên cố trước mọi chu kỳ điên cuồng của đám đông.",
        articles: [],
        comingSoon: true,
        color: "orange",
    },
]

export default function SeriesPage() {
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
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                            <BookOpen className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Lộ trình & <span className="text-[#e61c5c] italic font-medium">Series học tập</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Hệ thống bài đọc được sắp xếp từ nền tảng đến chuyên sâu — xây dựng năng lực tư duy phân tích doanh nghiệp và kiểm soát hành vi đầu tư.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative flex-grow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-16">
                    
                    {/* Series Cards Stack */}
                    <div className="space-y-8">
                        {seriesData.map((series, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "rounded-3xl border border-white/[0.06] bg-white/[0.01] p-6 md:p-8 transition-all duration-500",
                                    series.comingSoon 
                                        ? "opacity-60" 
                                        : "hover:border-[#e61c5c]/40 hover:shadow-xl hover:shadow-[#e61c5c]/5"
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20 font-bold text-sm font-sans">
                                                {index + 1}
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                                                {series.title}
                                            </h2>
                                        </div>
                                        <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                                            {series.description}
                                        </p>
                                    </div>
                                    {series.comingSoon && (
                                        <span className="self-start text-[10px] text-muted-foreground border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                                            Sắp ra mắt
                                        </span>
                                    )}
                                </div>

                                {series.articles.length > 0 && (
                                    <div className="border-t border-white/[0.06] pt-6">
                                        <ol className="space-y-4">
                                            {series.articles.map((article, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={article.slug}
                                                        className="group flex items-center gap-4 text-[#a0a5b5] hover:text-white transition-colors"
                                                    >
                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.04] text-xs font-semibold font-sans">
                                                            {i + 1}
                                                        </span>
                                                        <span className="font-sans text-sm group-hover:underline underline-offset-4 decoration-[#e61c5c]">
                                                            {article.title}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-[#e61c5c] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tip Box */}
                    <div className="max-w-4xl mx-auto border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8 space-y-3">
                        <h2 className="text-lg font-serif font-bold text-[#faf8f6] flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-accent" /> Đề xuất lộ trình đọc
                        </h2>
                        <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                            Nếu bạn là người mới ghé thăm website, chúng tôi khuyến khích đọc một cách có hệ thống theo đúng thứ tự từ trên xuống của Series 1. Mỗi bài viết đã được xây dựng làm tiền đề kiến thức hỗ trợ cho bài tiếp theo.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    )
}
