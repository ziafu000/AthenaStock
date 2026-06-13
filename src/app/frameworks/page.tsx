import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { ListChecks, ShieldAlert } from "lucide-react"

export const metadata = {
    title: "Frameworks – Đầu tư tỉnh thức",
    description: "Các framework phân tích doanh nghiệp và ra quyết định đầu tư.",
}

export default async function FrameworksPage() {
    const frameworks = await getAllPosts("framework")

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
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e61c5c]/10 text-[#e61c5c] border border-[#e61c5c]/20">
                            <ListChecks className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Checklists & <span className="text-[#e61c5c] italic font-medium">Frameworks</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Bộ khung tư duy và danh sách kiểm tra có hệ thống giúp bạn rà soát doanh nghiệp và loại bỏ các quyết định bốc đồng.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative flex-grow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-6xl relative z-10 space-y-16">
                    {frameworks.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {frameworks.map((post) => (
                                <div key={post.slug} className="h-full rounded-3xl border border-white/[0.06] bg-white/[0.01] hover:border-[#4271b3]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4271b3]/5">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01]">
                            <ListChecks className="w-12 h-12 text-muted-foreground/45 mx-auto mb-4" />
                            <p className="text-base text-[#a0a5b5] font-sans">Đang cập nhật danh mục framework...</p>
                            <p className="text-xs text-[#a0a5b5]/70 mt-2 font-sans">Vui lòng quay lại sau.</p>
                        </div>
                    )}

                    {/* Disclaimer / Warning Box */}
                    <div className="max-w-4xl mx-auto border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8 space-y-3">
                        <h2 className="text-lg font-serif font-bold text-[#faf8f6] flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-accent" /> Lưu ý quan trọng khi dùng Framework
                        </h2>
                        <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                            Các bộ checklist và framework là công cụ hỗ trợ rèn luyện tư duy có kỷ luật, chúng không phải là công thức toán học đảm bảo thành công tự động. Mọi quyết định đầu tư thực tế đều đòi hỏi sự linh hoạt và hiểu biết sâu sắc dựa trên hoàn cảnh riêng biệt của từng doanh nghiệp.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
