import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/mdx"
import { FileText } from "lucide-react"

export const metadata = {
    title: "Articles – Đầu tư tỉnh thức",
    description: "Các bài viết về tư duy đầu tư dài hạn và tâm lý hành vi.",
}

export default async function ArticlesPage() {
    const posts = await getAllPosts("article")

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                        <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Articles
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Suy ngẫm về đầu tư và cuộc sống. Đọc chậm, ghi chú cẩn thận.
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
                                <p className="text-lg">Chưa có bài viết nào.</p>
                                <p className="text-sm mt-2">Nội dung đang được cập nhật...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
