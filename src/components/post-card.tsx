import Link from "next/link"
import { getPostUrl, getTypeLabel, Post } from "@/lib/content-types"
import { Calendar, Clock, ArrowUpRight } from "lucide-react"

interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
    const postUrl = getPostUrl(post.metadata.type, post.slug)

    return (
        <article className="group relative flex flex-col justify-between card-premium-hover bg-card/60 backdrop-blur-md active:scale-[0.98] h-full">
            <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                        {getTypeLabel(post.metadata.type)}
                    </span>

                    {post.metadata.type === "business" && post.metadata.riskLevel && (
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${post.metadata.riskLevel === "high"
                                ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 ring-red-500/20"
                                : post.metadata.riskLevel === "medium"
                                    ? "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 ring-yellow-500/20"
                                    : "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 ring-green-500/20"
                            }`}>
                            {post.metadata.tickers ? post.metadata.tickers[0] : ""} •
                            {post.metadata.riskLevel === "high" ? " High Risk"
                                : post.metadata.riskLevel === "medium" ? " Medium Risk"
                                    : " Low Risk"}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="mb-3 text-xl font-bold font-serif leading-tight tracking-tight text-foreground group-hover:text-accent transition-colors duration-300 ease-out-expo line-clamp-2">
                    <Link href={postUrl}>
                        <span className="absolute inset-0" />
                        {post.metadata.title}
                    </Link>
                </h2>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans">
                    {post.metadata.description}
                </p>
            </div>

            {/* Meta Footer */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60 mt-auto font-sans">
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
                <div className="ml-auto opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out-expo text-accent">
                    <ArrowUpRight size={16} />
                </div>
            </div>
        </article>
    )
}
