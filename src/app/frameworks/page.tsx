import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { ListChecks } from "lucide-react"

export const metadata = {
    title: "Frameworks – Đầu tư tỉnh thức",
    description: "Các framework phân tích doanh nghiệp và ra quyết định đầu tư.",
}

export default async function FrameworksPage() {
    const frameworks = await getAllPosts("framework")

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100/50 dark:bg-purple-900/20 mb-6">
                        <ListChecks className="w-8 h-8 text-purple-700 dark:text-purple-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Frameworks
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Các bộ khung tư duy và checklist giúp bạn đánh giá doanh nghiệp một cách có hệ thống.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="space-y-8">
                        {frameworks.length > 0 ? (
                            frameworks.map((post) => (
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

            {/* Disclaimer */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-4xl">
                    <div className="rounded-lg border bg-background p-6">
                        <h2 className="font-semibold mb-2">Lưu ý quan trọng</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Framework là công cụ hỗ trợ tư duy, không phải công thức tự động.
                            Mọi quyết định đầu tư cần được suy xét kỹ lưỡng dựa trên hoàn cảnh cụ thể.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
