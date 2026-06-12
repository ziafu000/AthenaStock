import Link from "next/link"
import Image from "next/image"
import { PostCard } from "@/components/post-card"
import { getAllContent } from "@/lib/mdx"
import { ArrowRight, BookOpen, Brain, TrendingUp, ShieldCheck, FileText, ListChecks, Compass } from "lucide-react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"
import dynamic from "next/dynamic"

const ContentCarousel = dynamic(
  () => import("@/components/ui/ContentCarousel").then((mod) => mod.ContentCarousel),
  {
    loading: () => (
      <div className="w-full aspect-[16/9] md:aspect-[3/1] bg-card/20 animate-pulse rounded-2xl border border-border/40 flex items-center justify-center">
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans">Tải thư viện hoạt ảnh...</span>
      </div>
    ),
  }
)

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
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-500/20",
}

export default async function Home() {
    const latestPosts = await getFeaturedContent()

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative py-5 md:py-15 overflow-hidden bg-background">
                {/* Background ambient glows and grids */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[700px] bg-accent/5 rounded-full blur-[50px] md:blur-[100px] pointer-events-none" />

                <div className="container relative z-10 max-w-5xl text-center space-y-3">
                    {/* Logo with reveal */}
                    <div className="flex justify-center animate-fade-in-up">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={200}
                            height={200}
                            className="h-75 md:h-15 w-15 md:w-auto drop-shadow-2xl hover:scale-95 transition-transform duration-500"
                            priority
                        />
                    </div>

                    <div className="inline-flex items-center rounded-full border border-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-sm bg-accent/5 shadow-sm animate-fade-in-up-delay-1">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-accent mr-2 animate-pulse"></span>
                        Athena Stock • Đầu tư tỉnh thức
                    </div>

                    <h1 className="text-4xl font-serif font-bold tracking-tight text-primary sm:text-5xl md:text-6xl leading-[1.15] animate-fade-in-up-delay-2">
                        <span className="block mb-2 md:mb-4">Ngủ ngon với</span>
                        <span className="block text-accent italic font-medium">tiền của bạn</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed font-sans animate-fade-in-up-delay-3">
                        Chúng tôi không giúp bạn kiếm tiền nhanh hơn.<br className="hidden sm:block" />
                        Chúng tôi giúp bạn mắc ít sai lầm hơn — và bình an hơn với quyết định đầu tư.
                    </p>

                    <div className="w-full pt-4 animate-fade-in-up-delay-4">
                        <ContentCarousel />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up-delay-4">
                        <Link
                            href="/advisory"
                            className="w-full sm:w-auto h-12 px-8 rounded-lg border border-primary bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:bg-primary/95 transition-all shadow-md shadow-primary/10 active:scale-[0.97]"
                        >
                            Tìm hiểu cách chúng tôi làm việc
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto h-12 px-8 rounded-lg border border-border bg-background/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center transition-all active:scale-[0.97]"
                        >
                            Về chúng tôi & Triết lý
                        </Link>
                    </div>
                </div>
            </section>

            {/* PILLARS / FEATURES */}
            <section className="py-20 md:py-28 bg-secondary/15 relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.01)_50%,transparent)] pointer-events-none" />
                <div className="container max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Ba trụ cột của Đầu tư tỉnh thức</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                                Hệ thống tư duy giúp bạn đứng vững trước mọi biến động của thị trường.
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <ScrollReveal delay={100} duration={800}>
                            <div className="group relative overflow-hidden card-premium-hover h-full bg-background/80 backdrop-blur-md p-8">
                                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold font-serif text-primary">Business Mindset</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm font-sans">
                                    Không mua &quot;mã chứng khoán&quot;, mà mua &quot;phần sở hữu doanh nghiệp&quot;. Hiểu rõ mô hình kinh doanh, lợi thế cạnh tranh và định giá.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Pillar 2 */}
                        <ScrollReveal delay={200} duration={800}>
                            <div className="group relative overflow-hidden card-premium-hover h-full bg-background/80 backdrop-blur-md p-8">
                                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold font-serif text-primary">Margin of Safety</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm font-sans">
                                    Luôn đòi hỏi biên an toàn trong mọi quyết định. Bảo vệ vốn là ưu tiên số 1, kiếm lợi nhuận là ưu tiên số 2.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Pillar 3 */}
                        <ScrollReveal delay={300} duration={800}>
                            <div className="group relative overflow-hidden card-premium-hover h-full bg-background/80 backdrop-blur-md p-8">
                                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <Brain className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold font-serif text-primary">Behavioral Control</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm font-sans">
                                    Nhận diện các thiên kiến tâm lý (FOMO, Loss Aversion). Chiến thắng chính mình khó hơn chiến thắng thị trường.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* EXPLORE SECTIONS */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container max-w-6xl">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Khám phá</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                                Chọn chủ đề bạn muốn tìm hiểu sâu hơn.
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {exploreLinks.map((item, idx) => {
                            const Icon = item.icon
                            const colorClass = colorClasses[item.color as keyof typeof colorClasses]
                            return (
                                <ScrollReveal key={item.href} delay={idx * 70} duration={600}>
                                    <Link
                                        href={item.href}
                                        className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                                    >
                                        <div className={`mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${colorClass}`}>
                                            <Icon className="h-7 w-7 transition-transform group-hover:scale-110" />
                                        </div>
                                        <h3 className="font-bold text-primary mb-1 font-sans">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground font-sans">{item.description}</p>
                                    </Link>
                                </ScrollReveal>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* LATEST ANALYSIS & ARTICLES */}
            <section className="py-20 md:py-28 bg-secondary/10 relative">
                <div className="container max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                        <ScrollReveal direction="left" className="space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-primary">Phân tích & Bài viết</h2>
                            <p className="text-muted-foreground font-sans">Góc nhìn cá nhân về đầu tư giá trị và tâm lý thị trường.</p>
                        </ScrollReveal>
                        <ScrollReveal direction="right" className="self-start md:self-auto">
                            <Link
                                href="/articles"
                                className="group inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                            >
                                Xem tất cả
                                <ArrowRight size={16} className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </ScrollReveal>
                    </div>

                    {latestPosts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {latestPosts.map((post, idx) => (
                                <ScrollReveal key={post.slug} delay={idx * 100} duration={800}>
                                    <PostCard post={post} />
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal>
                            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-background/50 backdrop-blur-md">
                                <FileText className="w-12 h-12 text-muted-foreground/45 mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground font-sans">Nội dung đang được cập nhật...</p>
                                <p className="text-sm text-muted-foreground/70 mt-2 font-sans">Quay lại sau để xem bài viết mới nhất.</p>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            {/* QUOTE SECTION (REFINED AS AN ELEGANT FLOATING STATEMENT CARD) */}
            <section className="py-20 md:py-28 bg-background relative overflow-hidden">
                {/* Background decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10">
                    <ScrollReveal duration={1000}>
                        <div className="relative border border-accent/20 bg-accent/[0.02] dark:bg-accent/[0.01] rounded-3xl p-10 md:p-16 text-center shadow-xl shadow-accent/[0.02] backdrop-blur-sm">
                            <BookOpen className="mx-auto h-8 w-8 text-accent mb-6 opacity-75" />
                            <blockquote className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-primary">
                                &quot;Thị trường chứng khoán là công cụ chuyển tiền từ túi người thiếu kiên nhẫn sang túi người kiên nhẫn.&quot;
                            </blockquote>
                            <cite className="mt-8 block text-xs font-semibold text-accent not-italic uppercase tracking-widest">
                                — Warren Buffett
                            </cite>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* SOFT CTA */}
            <section className="py-20 md:py-28 bg-secondary/15">
                <div className="container max-w-3xl text-center">
                    <ScrollReveal className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                            Sẵn sàng đầu tư tỉnh thức?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto font-sans leading-relaxed">
                            Nếu bạn muốn trao đổi về hành trình đầu tư dài hạn — không phải để xin mã, mà để hiểu cách tư duy.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/advisory"
                                className="w-full sm:w-auto h-12 px-8 rounded-lg border border-primary bg-primary text-primary-foreground font-semibold flex items-center justify-center hover:bg-primary/95 transition-all shadow-md active:scale-[0.97]"
                            >
                                Tìm hiểu về Tư vấn
                            </Link>
                            <Link
                                href="/series"
                                className="w-full sm:w-auto h-12 px-8 rounded-lg border border-border bg-background/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center transition-all active:scale-[0.97]"
                            >
                                Bắt đầu đọc Series
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    )
}
