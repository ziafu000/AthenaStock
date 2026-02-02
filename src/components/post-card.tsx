import Link from "next/link"
import { Post, ContentType } from "@/lib/content-types"
import { Calendar, Clock, ArrowUpRight } from "lucide-react"

interface PostCardProps {
    post: Post
}

// Map content type to URL path
function getPostUrl(type: ContentType, slug: string): string {
    const pathMap: Record<ContentType, string> = {
        article: "articles",
        business: "business",
        psychology: "psychology",
        framework: "frameworks",
        library: "library",
    }
    return `/${pathMap[type]}/${slug}`
}

// Map content type to Vietnamese label
function getTypeLabel(type: ContentType): string {
    const labelMap: Record<ContentType, string> = {
        article: "Bài viết",
        business: "Doanh nghiệp",
        psychology: "Tâm lý",
        framework: "Framework",
        library: "Thư viện",
    }
    return labelMap[type]
}

export function PostCard({ post }: PostCardProps) {
    const postUrl = getPostUrl(post.metadata.type, post.slug)

    return (
        <article className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-accent/40 h-full">
            <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                        {getTypeLabel(post.metadata.type)}
                    </span>

                    {post.metadata.type === "business" && post.metadata.riskLevel && (
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${post.metadata.riskLevel === "high"
                                ? "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/20 dark:text-red-400"
                                : post.metadata.riskLevel === "medium"
                                    ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-400"
                                    : "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400"
                            }`}>
                            {post.metadata.tickers ? post.metadata.tickers[0] : ""} •
                            {post.metadata.riskLevel === "high" ? " High Risk"
                                : post.metadata.riskLevel === "medium" ? " Medium Risk"
                                    : " Low Risk"}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="mb-3 text-xl font-bold font-serif leading-tight tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    <Link href={postUrl}>
                        <span className="absolute inset-0" />
                        {post.metadata.title}
                    </Link>
                </h2>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.metadata.description}
                </p>
            </div>

            {/* Meta Footer */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t mt-auto">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <time dateTime={post.metadata.date}>
                        {new Date(post.metadata.date).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </time>
                </div>
                {post.metadata.readingTime && (
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.metadata.readingTime}</span>
                    </div>
                )}
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                    <ArrowUpRight size={16} />
                </div>
            </div>
        </article>
    )
}
