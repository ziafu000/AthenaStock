import Link from "next/link"
import Image from "next/image"
import { PostCard } from "@/components/post-card"
import { getAllContent } from "@/lib/mdx"
import { ArrowRight, BookOpen, Brain, TrendingUp, ShieldCheck, FileText, ListChecks, Compass } from "lucide-react"

async function getFeaturedContent() {
    const allPosts = await getAllContent()
    const latestPosts = allPosts.slice(0, 3)
    return latestPosts
}

const exploreLinks = [
    {
        title: "Business Analysis",
        description: "Phân tích mô hình kinh doanh",
        href: "/business",
        icon: TrendingUp,
        color: "blue",
    },
    {
        title: "Tâm lý & Hành vi",
        description: "Nhận diện thiên kiến tâm lý",
        href: "/psychology",
        icon: Brain,
        color: "orange",
    },
    {
        title: "Frameworks",
        description: "Checklist & bộ khung tư duy",
        href: "/frameworks",
        icon: ListChecks,
        color: "purple",
    },
    {
        title: "Series",
        description: "Lộ trình học có hệ thống",
        href: "/series",
        icon: Compass,
        color: "green",
    },
]

const colorClasses = {
    blue: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-900/30",
    orange: "bg-orange-100/50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 group-hover:bg-orange-200/50 dark:group-hover:bg-orange-900/30",
    purple: "bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 group-hover:bg-purple-200/50 dark:group-hover:bg-purple-900/30",
    green: "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 group-hover:bg-green-200/50 dark:group-hover:bg-green-900/30",
}

export default async function Home() {
    const latestPosts = await getFeaturedContent()

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative py-6 md:py-8 overflow-hidden bg-background">
                {/* Background Pattern - Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="container relative z-10 max-w-5xl text-center space-y-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={200}
                            height={200}
                            className="h-32 md:h-40 w-auto drop-shadow-xl"
                            priority
                        />
                    </div>

                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-accent backdrop-blur-sm bg-accent/5">
                        <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                        Athena Stock • Đầu tư tỉnh thức
                    </div>

                    <h1 className="text-4xl font-serif font-bold tracking-tight text-primary sm:text-5xl md:text-6xl leading-tight">
                        <span className="block mb-2 md:mb-4">Ngủ ngon với</span>
                        <span className="block text-accent italic">tiền của bạn</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                        Chúng tôi không giúp bạn kiếm tiền nhanh hơn.<br className="hidden sm:block" />
                        Chúng tôi giúp bạn mắc ít sai lầm hơn — và bình an hơn với quyết định đầu tư.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/advisory"
                            className="h-12 px-8 rounded-lg border-2 border-primary text-primary font-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                        >
                            Tìm hiểu cách chúng tôi làm việc
                        </Link>
                        <Link
                            href="/about"
                            className="h-12 px-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center justify-center transition-all"
                        >
                            Về chúng tôi & Triết lý
                        </Link>
                    </div>
                </div>
            </section>

            {/* PILLARS / FEATURES */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Ba trụ cột của Đầu tư tỉnh thức</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Hệ thống tư duy giúp bạn đứng vững trước mọi biến động của thị trường.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-serif">Business Mindset</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Không mua "mã chứng khoán", mà mua "phần sở hữu doanh nghiệp". Hiểu rõ mô hình kinh doanh, lợi thế cạnh tranh và định giá.
                            </p>
                        </div>

                        {/* Pillar 2 */}
                        <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100/50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-serif">Margin of Safety</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Luôn đòi hỏi biên an toàn trong mọi quyết định. Bảo vệ vốn là ưu tiên số 1, kiếm lợi nhuận là ưu tiên số 2.
                            </p>
                        </div>

                        {/* Pillar 3 */}
                        <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100/50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                                <Brain className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-serif">Behavioral Control</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Nhận diện các thiên kiến tâm lý (FOMO, Loss Aversion). Chiến thắng chính mình khó hơn chiến thắng thị trường.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXPLORE SECTIONS */}
            <section className="py-16 md:py-20">
                <div className="container max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Khám phá</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Chọn chủ đề bạn muốn tìm hiểu sâu hơn.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {exploreLinks.map((item) => {
                            const Icon = item.icon
                            const colorClass = colorClasses[item.color as keyof typeof colorClasses]
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className={`mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-colors ${colorClass}`}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* LATEST ANALYSIS & ARTICLES */}
            <section className="py-16 md:py-20 bg-muted/30">
                <div className="container max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-primary">Phân tích & Bài viết</h2>
                            <p className="text-muted-foreground mt-2">Góc nhìn cá nhân về đầu tư giá trị và tâm lý thị trường.</p>
                        </div>
                        <Link
                            href="/articles"
                            className="self-start md:self-auto flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                        >
                            Xem tất cả <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    {latestPosts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {latestPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 rounded-2xl border border-dashed bg-background">
                            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">Nội dung đang được cập nhật...</p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Quay lại sau để xem bài viết mới nhất.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-16 md:py-20 bg-primary text-primary-foreground">
                <div className="container max-w-4xl text-center">
                    <BookOpen className="mx-auto h-10 w-10 text-accent mb-6 opacity-80" />
                    <blockquote className="text-2xl md:text-3xl font-serif font-medium leading-relaxed italic">
                        &quot;Thị trường chứng khoán là công cụ chuyển tiền từ túi người thiếu kiên nhẫn sang túi người kiên nhẫn.&quot;
                    </blockquote>
                    <cite className="mt-6 block text-sm font-medium text-primary-foreground/70 not-italic uppercase tracking-widest">
                        — Warren Buffett
                    </cite>
                </div>
            </section>

            {/* SOFT CTA */}
            <section className="py-16 md:py-20">
                <div className="container max-w-3xl text-center">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
                        Sẵn sàng đầu tư tỉnh thức?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Nếu bạn muốn trao đổi về hành trình đầu tư dài hạn — không phải để xin mã, mà để hiểu cách tư duy.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/advisory"
                            className="h-12 px-8 rounded-lg border-2 border-primary text-primary font-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            Tìm hiểu về Tư vấn
                        </Link>
                        <Link
                            href="/series"
                            className="h-12 px-8 rounded-lg bg-muted text-foreground font-medium flex items-center justify-center hover:bg-muted/80 transition-all"
                        >
                            Bắt đầu đọc Series
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
