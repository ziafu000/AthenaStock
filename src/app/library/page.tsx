import Link from "next/link"
import { BookOpen, Quote, ListChecks, BookMarked, Library } from "lucide-react"

export const metadata = {
    title: "Library – Athena Stock",
    description: "Tài nguyên chọn lọc: sách kinh điển, thuật ngữ, checklist và trích dẫn để nâng cao năng lực phân tích đầu tư.",
}

const resources = [
    {
        title: "Checklists & Frameworks",
        description: "Các danh sách kiểm tra và bộ khung phân tích có thể sử dụng ngay để đánh giá doanh nghiệp.",
        icon: ListChecks,
        href: "/frameworks",
        comingSoon: false,
    },
    {
        title: "Sách hay nên đọc",
        description: "Danh sách curated các cuốn sách kinh điển về đầu tư giá trị và tâm lý học hành vi.",
        icon: BookOpen,
        href: "/library/books",
        comingSoon: true,
    },
    {
        title: "Trích dẫn kinh điển",
        description: "Những câu nói đáng suy ngẫm từ Warren Buffett, Charlie Munger, Benjamin Graham...",
        icon: Quote,
        href: "/library/quotes",
        comingSoon: true,
    },
    {
        title: "Thuật ngữ (Glossary)",
        description: "Giải thích các khái niệm tài chính phức tạp bằng ngôn ngữ đơn giản, trực quan.",
        icon: BookMarked,
        href: "/library/glossary",
        comingSoon: true,
    },
]

export default function LibraryPage() {
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
                            <Library className="w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Thư viện <span className="text-[#e61c5c] italic font-medium">Tài nguyên</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Tài nguyên chọn lọc để nâng cao năng lực phân tích. Đọc chậm, suy ngẫm sâu và ghi chú cẩn thận.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Glassmorphic Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-4xl relative z-10 space-y-16">
                    {/* Resources Grid */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {resources.map((resource) => {
                            const Icon = resource.icon

                            if (resource.comingSoon) {
                                return (
                                    <div
                                        key={resource.title}
                                        className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 backdrop-blur-md opacity-50 flex flex-col justify-between h-[180px] select-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-muted-foreground border border-white/10">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-sans uppercase tracking-widest text-[#a0a5b5] border border-white/10 px-2 py-0.5 rounded-full bg-white/5 font-semibold">
                                                Sắp có
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-serif font-bold text-[#faf8f6] mb-1">
                                                {resource.title}
                                            </h2>
                                            <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-2">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={resource.title}
                                    href={resource.href}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#e61c5c]/40 hover:bg-[#e61c5c]/[0.02] transition-all duration-300 shadow-md hover:-translate-y-1 flex flex-col justify-between h-[180px]"
                                >
                                    <div className="absolute -inset-px bg-gradient-to-br from-[#e61c5c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20 group-hover:bg-[#e61c5c] group-hover:text-white transition-colors duration-300">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-sans uppercase tracking-widest text-[#e61c5c] border border-[#e61c5c]/20 px-2 py-0.5 rounded-full bg-[#e61c5c]/5 font-semibold">
                                            Truy cập
                                        </span>
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-lg font-serif font-bold text-white mb-1 group-hover:text-[#e61c5c] transition-colors">
                                            {resource.title}
                                        </h2>
                                        <p className="text-xs text-[#a0a5b5] leading-relaxed font-sans line-clamp-2">
                                            {resource.description}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Notes Section */}
                    <div className="relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-transparent pointer-events-none rounded-3xl" />
                        <h2 className="text-xl font-serif font-bold mb-3 text-white flex items-center gap-2">
                            <span>Ghi chú của bạn</span>
                        </h2>
                        <p className="text-sm text-[#a0a5b5] mb-6 font-sans">
                            Các đoạn trích dẫn nổi bật (highlights) và ghi chú bạn đã lưu trong quá trình đọc bài sẽ được tổng hợp ở đây.
                        </p>
                        <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center text-muted-foreground bg-white/[0.01]">
                            <p className="font-medium text-white text-sm">Chức năng ghi chú đang được hoàn thiện</p>
                            <p className="text-xs mt-2 text-[#a0a5b5]">
                                Tất cả dữ liệu của bạn sẽ được lưu trữ an toàn, riêng tư và hoàn toàn cục bộ trên trình duyệt của bạn (localStorage).
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
