import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { Brain, Quote, ShieldAlert } from "lucide-react"

export const metadata = {
    title: "Tâm lý nhà đầu tư – Athena Stock",
    description: "Các bài viết về tài chính hành vi, thiên kiến nhận thức và kỷ luật ra quyết định.",
}

export default async function PsychologyPage() {
    const posts = await getAllPosts("psychology")

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
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9c1850]/10 text-[#9c1850] dark:text-[#e24a8d] border border-[#9c1850]/20">
                            <Brain className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#9c1850] dark:text-[#faf8f6] leading-tight">
                        Tâm lý & <span className="text-[#e61c5c] italic font-medium">Hành vi</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-gray-650 dark:text-[#a0a5b5] leading-relaxed font-sans">
                        Tìm hiểu cách thiên kiến, cảm xúc và bối cảnh ảnh hưởng đến quá trình ra quyết định đầu tư.
                    </p>
                </div>
            </section>

            {/* BODY SECTION (Dark Theme) */}
            <section className="py-24 bg-[#090d16] text-white relative flex-grow">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-6xl relative z-10 space-y-20">
                    
                    {/* Buffett Temperament Quote Box */}
                    <div className="max-w-4xl mx-auto relative border border-white/[0.06] bg-white/[0.02] rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md">
                        <div className="absolute -inset-px bg-gradient-to-br from-[#9c1850]/5 to-[#4271b3]/5 pointer-events-none rounded-3xl" />
                        <Quote className="mx-auto h-8 w-8 text-[#e61c5c] mb-6 opacity-75 animate-pulse" />
                        <blockquote className="text-lg md:text-xl font-serif font-medium leading-relaxed italic text-white">
                            &quot;Đầu tư không phải là trò chơi mà kẻ có IQ 160 đánh bại kẻ có IQ 130. Khi bạn có trí thông minh bình thường, thứ bạn cần là tính khí để kiểm soát những ham muốn khiến người khác gặp rắc rối.&quot;
                        </blockquote>
                        <cite className="mt-6 block text-xs font-semibold text-[#e61c5c] not-italic uppercase tracking-widest">
                            — Warren Buffett
                        </cite>
                    </div>

                    {/* Posts List */}
                    {posts.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <div key={post.slug} className="h-full rounded-3xl border border-white/[0.06] bg-white/[0.01] hover:border-[#4271b3]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4271b3]/5">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.01]">
                            <Brain className="w-12 h-12 text-muted-foreground/45 mx-auto mb-4" />
                            <p className="text-base text-[#a0a5b5] font-sans">Chưa có bài viết tâm lý nào.</p>
                            <p className="text-xs text-[#a0a5b5]/70 mt-2 font-sans">Đang chuẩn bị nội dung, vui lòng quay lại sau.</p>
                        </div>
                    )}

                    {/* Why Temperament Matters Info Box */}
                    <div className="max-w-4xl mx-auto border border-white/[0.06] bg-white/[0.01] rounded-2xl p-6 md:p-8 space-y-3">
                        <h2 className="text-lg font-serif font-bold text-[#faf8f6] flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-accent" /> Tâm lý ảnh hưởng đến quyết định thế nào?
                        </h2>
                        <p className="text-sm text-[#a0a5b5] leading-relaxed font-sans">
                            Tài chính hành vi giúp nhận diện cách con người xử lý thông tin không hoàn hảo, phản ứng với biến động và duy trì niềm tin sẵn có. Hiểu các xu hướng này giúp nhà đầu tư thiết kế quy trình có điểm kiểm tra và khoảng dừng phù hợp.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    )
}
