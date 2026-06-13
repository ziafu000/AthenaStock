import { Search } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { getAllContent } from "@/lib/mdx"

export const metadata = {
    title: "Tìm kiếm",
    description: "Tìm bài viết, phân tích doanh nghiệp, framework và nội dung tâm lý đầu tư trên Athena Stock.",
}

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

function normalize(value: string) {
    return value.trim().toLocaleLowerCase("vi-VN")
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "" } = await searchParams
    const query = normalize(q)
    const posts = await getAllContent()
    const results = query
        ? posts.filter((post) => {
            const searchableText = [
                post.metadata.title,
                post.metadata.description,
                post.metadata.type,
                ...(post.metadata.tags ?? []),
                ...(post.metadata.tickers ?? []),
            ]
                .join(" ")
                .toLocaleLowerCase("vi-VN")

            return searchableText.includes(query)
        })
        : []

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

                <div className="container relative z-10 max-w-3xl text-center space-y-4">
                    <div className="flex justify-center mb-2">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                            <Search className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Tìm kiếm <span className="text-[#e61c5c] italic font-medium">nội dung</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans mb-6">
                        Tìm kiếm bài viết, mã cổ phiếu (FPT, MWG...), triết lý, framework hoặc từ khóa bất kỳ.
                    </p>

                    <form action="/search" className="mt-8 flex flex-col gap-3 sm:flex-row max-w-xl mx-auto">
                        <input
                            type="search"
                            name="q"
                            defaultValue={q}
                            placeholder="Nhập từ khóa (Ví dụ: FPT, biên an toàn, FOMO...)"
                            className="h-12 min-w-0 flex-1 rounded-full border border-gray-300 dark:border-white/20 bg-background/50 backdrop-blur-md px-6 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-[#e61c5c] focus:ring-1 focus:ring-[#e61c5c] dark:text-white"
                        />
                        <button
                            type="submit"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-[#9c1850] hover:bg-[#861244] text-white px-8 text-sm font-semibold transition-all active:scale-[0.97] shadow-md"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>
            </section>

            {/* BODY SECTION (Dark Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative flex-grow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-6xl relative z-10">
                    {query ? (
                        <div className="space-y-8">
                            <p className="text-sm text-[#a0a5b5] font-sans">
                                {results.length > 0
                                    ? `Tìm thấy ${results.length} kết quả phù hợp cho "${q}"`
                                    : `Không tìm thấy kết quả nào cho từ khóa "${q}"`}
                            </p>
                            
                            {results.length > 0 && (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {results.map((post) => (
                                        <div key={`${post.metadata.type}-${post.slug}`} className="h-full rounded-3xl border border-white/[0.06] bg-white/[0.01] hover:border-[#4271b3]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4271b3]/5">
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01] text-[#a0a5b5] font-sans max-w-3xl mx-auto">
                            Nhập từ khóa tìm kiếm bên trên để tra cứu toàn bộ dữ liệu bài viết và các khung phân tích.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
