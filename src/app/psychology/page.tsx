import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { Brain, Quote } from "lucide-react"

export const metadata = {
    title: "Tâm lý & Hành vi – Đầu tư tỉnh thức",
    description: "Hiểu về tâm lý học đầu tư và các thiên kiến nhận thức.",
}

export default async function PsychologyPage() {
    const posts = await getAllPosts("psychology")

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100/50 dark:bg-orange-900/20 mb-6">
                        <Brain className="w-8 h-8 text-orange-700 dark:text-orange-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Tâm lý & Hành vi
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Nhận diện các thiên kiến nhận thức và sai lầm tâm lý thường gặp.
                        Hiểu cách bộ não hoạt động để không trở thành nạn nhân của chính mình.
                    </p>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-12 bg-primary/5 border-y">
                <div className="container max-w-3xl">
                    <div className="flex gap-4">
                        <Quote className="w-8 h-8 text-accent shrink-0 mt-1" />
                        <div>
                            <p className="text-lg font-serif italic text-foreground/90 leading-relaxed">
                                "Investing is not a game where the guy with the 160 IQ beats the guy with 130 IQ.
                                Once you have ordinary intelligence, what you need is the temperament to control
                                the urges that get other people into trouble."
                            </p>
                            <cite className="block mt-3 text-sm text-muted-foreground not-italic">
                                — Warren Buffett
                            </cite>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="space-y-8">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))
                        ) : (
                            <div className="text-center py-16 text-muted-foreground">
                                <p className="text-lg">Đang cập nhật nội dung...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Psychology Matters */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-4xl">
                    <div className="rounded-lg border bg-background p-6">
                        <h2 className="font-semibold mb-3">Tại sao Tâm lý quan trọng?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Phần lớn nhà đầu tư thua lỗ không phải vì thiếu kiến thức,
                            mà vì không kiểm soát được cảm xúc và hành vi. FOMO, tham lam, sợ hãi,
                            và nghiện giao dịch là những kẻ thù vô hình lớn nhất của nhà đầu tư.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
