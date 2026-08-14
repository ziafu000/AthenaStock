"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { getPostUrl, getTypeLabel, Post } from "@/lib/content-types"

interface RelatedPostsProps {
    posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        setMessage("")
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus("success")
                setEmail("")
            } else {
                setStatus("error")
                setMessage(data.error || "Có lỗi xảy ra khi đăng ký.")
            }
        } catch (err) {
            console.error(err)
            setStatus("error")
            setMessage("Không thể kết nối tới máy chủ.")
        }
    }

    return (
        <section className="not-prose mt-12 border-t border-border/60 pt-8">
            <div className="rounded-2xl border border-border/40 bg-secondary/10 dark:bg-white/[0.02] p-6 md:p-8 backdrop-blur-sm shadow-sm">
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-[#9c1850] dark:text-[#faf8f6]">Đọc tiếp có chọn lọc</h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">
                            Nhận các bài viết dài về doanh nghiệp, framework và tâm lý nhà đầu tư, hoặc tiếp tục với các bài liên quan.
                        </p>
                    </div>

                    <div className="w-full border-t border-border/20 pt-4">
                        {status === "success" ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-sm border border-green-500/20 bg-green-500/5 px-4 py-2.5 rounded-full animate-in fade-in duration-300 w-fit">
                                <span>✓ Đăng ký thành công! Hãy kiểm tra email chào mừng.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5 w-full font-sans items-center">
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 items-center w-full max-w-xl">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email của bạn..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10 w-full sm:flex-1 rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-[#e61c5c] focus:ring-1 focus:ring-[#e61c5c] text-foreground"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="inline-flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full border border-primary bg-primary text-primary-foreground px-6 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        <Mail className="h-4 w-4" />
                                        {status === "loading" ? "Đang gửi..." : "Nhận bài viết mới"}
                                    </button>
                                </form>
                                {status === "error" && (
                                    <p className="text-xs text-red-550 dark:text-red-400 pl-3">
                                        ⚠️ {message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
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
