import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/mdx"
import { TrendingUp } from "lucide-react"

export const metadata = {
    title: "Business Analysis – Đầu tư tỉnh thức",
    description: "Phân tích doanh nghiệp chuyên sâu theo triết lý Warren Buffett.",
}

export default async function BusinessListingPage() {
    const posts = await getAllPosts("business")

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100/50 dark:bg-blue-900/20 mb-6">
                        <TrendingUp className="w-8 h-8 text-blue-700 dark:text-blue-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Business Analysis
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Hiểu đúng bản chất doanh nghiệp. Phân tích chuyên sâu theo triết lý Warren Buffett.
                    </p>
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
                                <p className="text-lg">Chưa có bài phân tích nào.</p>
                                <p className="text-sm mt-2">Nội dung đang được cập nhật...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Info Box */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-4xl">
                    <div className="rounded-lg border bg-background p-6">
                        <h2 className="font-semibold mb-2">Về Business Analysis</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Mỗi bài phân tích tập trung vào việc hiểu mô hình kinh doanh, lợi thế cạnh tranh,
                            và giá trị nội tại của doanh nghiệp — không phải dự đoán giá hay khuyến nghị mua/bán.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
