import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { getPostUrl, getTypeLabel, Post } from "@/lib/content-types"

interface RelatedPostsProps {
    posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    return (
        <section className="not-prose mt-12 border-t pt-8">
            <div className="rounded-lg border bg-secondary/30 p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-md">
                        <h2 className="font-serif text-2xl font-bold text-primary">Đọc tiếp có chọn lọc</h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            Một vài bài liên quan để nối tiếp mạch đọc, hoặc để lại email nếu bạn muốn nhận bài viết mới.
                        </p>
                    </div>
                    <a
                        href="mailto:contact@athenastock.vn?subject=Nhận bài viết mới từ Athena Stock"
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                        <Mail className="h-4 w-4" />
                        Nhận bài viết mới
                    </a>
                </div>

                {posts.length > 0 && (
                    <div className="mt-6 grid gap-3">
                        {posts.map((post) => (
                            <Link
                                key={`${post.metadata.type}-${post.slug}`}
                                href={getPostUrl(post.metadata.type, post.slug)}
                                className="group flex items-center justify-between gap-4 rounded-md bg-background px-4 py-3 text-sm transition-colors hover:text-accent"
                            >
                                <span>
                                    <span className="mr-2 text-xs font-medium text-muted-foreground">
                                        {getTypeLabel(post.metadata.type)}
                                    </span>
                                    <span className="font-medium">{post.metadata.title}</span>
                                </span>
                                <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
