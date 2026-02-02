import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

export const metadata = {
    title: "Series – Đầu tư tỉnh thức",
    description: "Lộ trình đọc có hệ thống để xây dựng nền tảng đầu tư vững chắc.",
}

const seriesData = [
    {
        title: "Nền tảng Đầu tư Tỉnh thức",
        description: "Bắt đầu từ đây: hiểu triết lý, nhận diện sai lầm, và có hệ thống đánh giá doanh nghiệp.",
        articles: [
            { slug: "/articles/triet-ly-dai-han", title: "Triết lý Đầu tư Dài hạn & Margin of Safety" },
            { slug: "/psychology/sai-lam-hanh-vi", title: "Sai lầm Hành vi: FOMO, Tham-Sợ & Nghiện Giao dịch" },
            { slug: "/frameworks/checklist-phan-tich", title: "Checklist Phân tích Doanh nghiệp" },
        ],
        color: "accent",
    },
    {
        title: "Đọc hiểu Báo cáo Tài chính",
        description: "Loạt bài giúp bạn đọc và hiểu những con số trong báo cáo tài chính một cách đơn giản.",
        articles: [],
        comingSoon: true,
        color: "blue",
    },
    {
        title: "Tâm lý học Đầu tư",
        description: "Khám phá các thiên kiến nhận thức và cách vượt qua chúng.",
        articles: [],
        comingSoon: true,
        color: "orange",
    },
]

export default function SeriesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                        <BookOpen className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Series
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Lộ trình đọc có hệ thống. Mỗi series là một hành trình học tập,
                        giúp bạn xây dựng nền tảng vững chắc.
                    </p>
                </div>
            </section>

            {/* Series List */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="space-y-6">
                        {seriesData.map((series, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl border bg-card p-6 md:p-8 transition-all ${series.comingSoon ? "opacity-70" : "hover:shadow-lg hover:border-accent/40"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-serif font-bold">
                                                {series.title}
                                            </h2>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {series.description}
                                        </p>
                                    </div>
                                    {series.comingSoon && (
                                        <span className="self-start text-xs text-muted-foreground border px-3 py-1 rounded-full">
                                            Đang cập nhật
                                        </span>
                                    )}
                                </div>

                                {series.articles.length > 0 && (
                                    <div className="border-t pt-6">
                                        <ol className="space-y-3">
                                            {series.articles.map((article, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={article.slug}
                                                        className="group flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors"
                                                    >
                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                                            {i + 1}
                                                        </span>
                                                        <span className="group-hover:underline underline-offset-4">
                                                            {article.title}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tip Section */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-4xl">
                    <div className="rounded-lg border bg-background p-6">
                        <h2 className="font-semibold mb-2">💡 Gợi ý</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Nếu bạn mới bắt đầu, hãy đọc theo thứ tự từ Series 1.
                            Mỗi bài viết được thiết kế để xây dựng dựa trên kiến thức từ bài trước.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
