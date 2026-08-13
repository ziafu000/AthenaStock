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
        color: "wine",
    },
    {
        title: "Frameworks",
        description: "Checklist & bộ khung tư duy",
        href: "/frameworks",
        icon: ListChecks,
        color: "crimson",
    },
    {
        title: "Series",
        description: "Lộ trình học có hệ thống",
        href: "/series",
        icon: Compass,
        color: "slate",
    },
]

const colorClasses = {
    blue: "bg-[#4271b3]/10 text-[#4271b3] group-hover:bg-[#4271b3]/20",
    wine: "bg-[#9c1850]/10 text-[#9c1850] dark:text-[#e24a8d] group-hover:bg-[#9c1850]/20",
    crimson: "bg-[#e61c5c]/10 text-[#e61c5c] group-hover:bg-[#e61c5c]/20",
    slate: "bg-gray-500/10 text-gray-500 dark:text-gray-400 group-hover:bg-gray-500/20",
}

export default async function Home() {
    const latestPosts = await getFeaturedContent()

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* HERO SECTION (Light Serene Theme with Nature Background) */}
            <section className="relative py-20 md:py-15 overflow-hidden bg-background">
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

                <div className="container relative z-10 max-w-5xl text-center space-y-3">
                    {/* Logo */}
                    <div className="flex justify-center animate-fade-in-up">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={280}
                            height={280}
                            className="h-75 md:h-15 w-15 md:w-auto drop-shadow-2xl hover:scale-95 transition-transform duration-500"
                            priority
                        />
                    </div>

                    {/* Logo Badge */}
                    <div className="inline-flex items-center rounded-full border border-[#e61c5c]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e61c5c] backdrop-blur-sm bg-[#e61c5c]/5 shadow-sm animate-fade-in-up-delay-1">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#e61c5c] mr-2 animate-pulse"></span>
                        ATHENA STOCK • INVESTMENT THINKING HOUSE
                    </div>

                    {/* Headline combining Playfair Serif Bold & Playfair Serif Italic */}
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] animate-fade-in-up-delay-2">
                        <span className="block mb-1">Đầu tư như một</span>
                        <span className="text-[#e61c5c] italic font-medium block mt-3">người chủ doanh nghiệp</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-sm md:text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans animate-fade-in-up-delay-3">
                        Không mua "mã chứng khoán", mà mua phần sở hữu doanh nghiệp.<br className="hidden sm:block" />
                        Nghiên cứu có chiều sâu. Tư duy có kỷ luật. Quyết định tự chủ.
                    </p>

                    {/* Content Carousel container */}
                    <div className="w-full pt-6 animate-fade-in-up-delay-4">
                        <ContentCarousel />
                    </div>

                    {/* CTA Buttons in Hero */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up-delay-4">
                        <Link
                            href="/advisory"
                            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold flex items-center justify-center transition-all shadow-md active:scale-[0.97]"
                        >
                            Tìm hiểu cách chúng tôi làm việc
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto h-12 px-8 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100/50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center transition-all active:scale-[0.97]"
                        >
                            Về chúng tôi & Triết lý
                        </Link>
                    </div>
                </div>
            </section>

            {/* PILLARS / FEATURES (Dark Glassmorphic Section) */}
            <section className="py-24 md:py-32 bg-[#090d16] relative text-white">
                {/* Delicate background ambient glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-6xl relative z-10">
                    <div className="text-center mb-20">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4">
                                Ba trụ cột của <span className="font-serif italic font-light text-[#e61c5c]">tư duy đầu tư</span>
                            </h2>
                            <p className="text-[#a0a5b5] max-w-2xl mx-auto text-sm md:text-base font-sans">
                                Hệ thống tư duy giúp bạn phân tích doanh nghiệp, kiểm soát hành vi và ra quyết định độc lập.
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pillar 1 - Business Mindset */}
                        <ScrollReveal delay={100} duration={800}>
                            <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4271b3]/5 flex flex-col justify-between h-full">
                                <div className="absolute -inset-px bg-gradient-to-r from-[#4271b3]/0 via-[#4271b3]/8 to-[#4271b3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                                <div>
                                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] text-[#4271b3] border border-white/[0.08]">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold font-serif text-white">Business Mindset</h3>
                                    <p className="text-[#a0a5b5] leading-relaxed text-sm font-sans">
                                        Không mua &quot;mã chứng khoán&quot;, mà mua &quot;phần sở hữu doanh nghiệp&quot;. Hiểu rõ mô hình kinh doanh, lợi thế cạnh tranh và định giá.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Pillar 2 - Margin of Safety */}
                        <ScrollReveal delay={200} duration={800}>
                            <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e61c5c]/5 flex flex-col justify-between h-full">
                                <div className="absolute -inset-px bg-gradient-to-r from-[#e61c5c]/0 via-[#e61c5c]/8 to-[#e61c5c]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                                <div>
                                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] text-[#e61c5c] border border-white/[0.08]">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold font-serif text-white">Margin of Safety</h3>
                                    <p className="text-[#a0a5b5] leading-relaxed text-sm font-sans">
                                        Luôn đòi hỏi biên an toàn trong mọi quyết định. Bảo vệ vốn là ưu tiên số 1, kiếm lợi nhuận là ưu tiên số 2.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Pillar 3 - Behavioral Control */}
                        <ScrollReveal delay={300} duration={800}>
                            <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#9c1850]/5 flex flex-col justify-between h-full">
                                <div className="absolute -inset-px bg-gradient-to-r from-[#9c1850]/0 via-[#9c1850]/8 to-[#9c1850]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                                <div>
                                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] text-[#9c1850] dark:text-[#e24a8d] border border-white/[0.08]">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold font-serif text-white">Behavioral Control</h3>
                                    <p className="text-[#a0a5b5] leading-relaxed text-sm font-sans">
                                        Nhận diện các thiên kiến tâm lý (FOMO, Loss Aversion). Chiến thắng chính mình khó hơn chiến thắng thị trường.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* EXPLORE SECTIONS (Dark Bento Grid Section) */}
            <section className="py-24 md:py-32 bg-[#090d16] relative text-white">
                <div className="container max-w-6xl">
                    <div className="text-center mb-20">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4">
                                Khám phá <span className="font-serif italic font-light text-[#4271b3]">chủ đề đầu tư</span>
                            </h2>
                            <p className="text-[#a0a5b5] max-w-2xl mx-auto text-sm md:text-base font-sans">
                                Chọn chủ đề bạn muốn tìm hiểu sâu hơn.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Bento Grid with diverse glass backgrounds matching reference styles */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {exploreLinks.map((item, idx) => {
                            const Icon = item.icon
                            const colorClass = colorClasses[item.color as keyof typeof colorClasses]

                            // Define custom background visual variants for the bento layout
                            let bgClass = "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-[#4271b3]/40"
                            if (item.color === "wine") {
                                bgClass = "bg-gradient-to-br from-[#9c1850]/5 to-transparent border-white/[0.06] hover:from-[#9c1850]/15 hover:border-[#9c1850]/40"
                            } else if (item.color === "crimson") {
                                bgClass = "bg-gradient-to-tr from-[#e61c5c]/5 to-transparent border-white/[0.06] hover:from-[#e61c5c]/15 hover:border-[#e61c5c]/40"
                            } else if (item.color === "slate") {
                                bgClass = "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03] hover:border-gray-500/40"
                            }

                            return (
                                <ScrollReveal key={item.href} delay={idx * 70} duration={600}>
                                    <Link
                                        href={item.href}
                                        className={`group flex flex-col items-center text-center p-8 rounded-3xl border backdrop-blur-md hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-500 active:scale-[0.98] ${bgClass}`}
                                    >
                                        <div className={`mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 border border-white/[0.08] ${colorClass}`}>
                                            <Icon className="h-7 w-7 transition-transform group-hover:scale-110" />
                                        </div>
                                        <h3 className="font-bold text-white mb-2 font-sans tracking-wide">{item.title}</h3>
                                        <p className="text-xs text-[#a0a5b5] font-sans leading-relaxed">{item.description}</p>
                                    </Link>
                                </ScrollReveal>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* LATEST ANALYSIS & ARTICLES (Dark Glassmorphic Grid) */}
            <section className="py-24 md:py-32 bg-[#090d16] relative text-white">
                <div className="container max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
                        <ScrollReveal direction="left" className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white">
                                Phân tích <span className="font-serif italic font-light text-[#e61c5c]">& Bài viết</span>
                            </h2>
                            <p className="text-[#a0a5b5] font-sans text-sm md:text-base">Góc nhìn nghiên cứu về đầu tư giá trị và tâm lý thị trường.</p>
                        </ScrollReveal>
                        <ScrollReveal direction="right" className="self-start md:self-auto">
                            <Link
                                href="/articles"
                                className="group inline-flex items-center text-sm font-semibold text-[#e61c5c] hover:text-[#e61c5c]/80 transition-colors"
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
                                    <div className="h-full rounded-3xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] transition-colors duration-500">
                                        <PostCard post={post} />
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal>
                            <div className="text-center py-16 rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] backdrop-blur-md">
                                <FileText className="w-12 h-12 text-muted-foreground/45 mx-auto mb-4" />
                                <p className="text-base text-[#a0a5b5] font-sans">Nội dung đang được cập nhật...</p>
                                <p className="text-xs text-[#a0a5b5]/70 mt-2 font-sans">Quay lại sau để xem bài viết mới nhất.</p>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            {/* QUOTE SECTION (Elegant Floating Slate Box) */}
            <section className="py-24 md:py-32 bg-[#090d16] relative overflow-hidden">
                <div className="container max-w-4xl relative z-10">
                    <ScrollReveal duration={1000}>
                        <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-10 md:p-16 text-center shadow-2xl backdrop-blur-md">
                            <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                            <BookOpen className="mx-auto h-8 w-8 text-[#e61c5c] mb-6 opacity-75" />
                            <blockquote className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-white">
                                &quot;Thị trường chứng khoán là công cụ chuyển tiền từ túi người thiếu kiên nhẫn sang túi người kiên nhẫn.&quot;
                            </blockquote>
                            <cite className="mt-8 block text-xs font-semibold text-[#e61c5c] not-italic uppercase tracking-widest">
                                — Warren Buffett
                            </cite>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* SOFT CTA & FOOTER (Light Serene Theme with Nature Background) */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-background text-foreground transition-colors duration-500">
                {/* Serene misty valley background - Light Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-multiply pointer-events-none dark:hidden"
                    style={{ backgroundImage: "url('/images/misty_footer_bg.png')" }}
                />

                {/* Serene misty valley background - Dark Mode */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none hidden dark:block"
                    style={{ backgroundImage: "url('/images/misty_footer_bg_dark.png')" }}
                />

                {/* Smooth top-overlay to transition from the dark body above */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#090d16] to-transparent pointer-events-none" />

                <div className="container max-w-3xl text-center relative z-10">
                    <ScrollReveal className="space-y-8">
                        {/* Heading combining Outfit Sans & Playfair Serif Italic */}
                        <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-[#1c1d21] dark:text-[#faf8f6] leading-tight">
                            Sẵn sàng <span className="font-serif italic font-light text-[#9c1850] dark:text-[#e61c5c] block mt-1">xây dựng tư duy đầu tư?</span>
                        </h2>

                        <p className="max-w-xl mx-auto font-sans leading-relaxed text-sm md:text-base text-gray-650 dark:text-[#a0a5b5]">
                            Nếu bạn muốn trao đổi về hành trình đầu tư dài hạn — không phải để xin mã, mà để hiểu cách tư duy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/advisory"
                                className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold flex items-center justify-center transition-all shadow-md active:scale-[0.97]"
                            >
                                Tìm hiểu về Tư vấn
                            </Link>
                            <Link
                                href="/series"
                                className="w-full sm:w-auto h-12 px-8 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100/50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center transition-all active:scale-[0.97]"
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
