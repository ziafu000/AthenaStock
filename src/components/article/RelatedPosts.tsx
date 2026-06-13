import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { getPostUrl, getTypeLabel, Post } from "@/lib/content-types"

interface RelatedPostsProps {
    posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    return (
        <section className="not-prose mt-12 border-t border-border/60 pt-8">
            <div className="rounded-2xl border border-border/40 bg-secondary/10 dark:bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-md">
                        <h2 className="font-serif text-2xl font-bold text-[#9c1850] dark:text-[#faf8f6]">Đọc tiếp có chọn lọc</h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">
                            Một vài bài liên quan để nối tiếp mạch đọc, hoặc để lại email nếu bạn muốn nhận bài viết mới.
                        </p>
                    </div>
                    <a
                        href="mailto:contact@athenastock.vn?subject=Nhận bài viết mới từ Athena Stock"
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-primary bg-primary text-primary-foreground px-5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm font-sans"
                    >
                        <Mail className="h-4 w-4" />
                        Nhận bài viết mới
                    </a>
                </div>

                {posts.length > 0 && (
                    <div className="mt-6 grid gap-3 font-sans">
                        {posts.map((post) => (
                            <Link
                                key={`${post.metadata.type}-${post.slug}`}
                                href={getPostUrl(post.metadata.type, post.slug)}
                                className="group flex items-center justify-between gap-4 rounded-xl bg-card border border-border/30 px-4 py-3.5 text-sm transition-all hover:border-[#e61c5c]/30 hover:shadow-sm hover:text-[#e61c5c]"
                            >
                                <span>
                                    <span className="mr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {getTypeLabel(post.metadata.type)}
                                    </span>
                                    <span className="font-medium text-foreground group-hover:text-[#e61c5c] transition-colors">{post.metadata.title}</span>
                                </span>
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-1 group-hover:text-[#e61c5c]" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
