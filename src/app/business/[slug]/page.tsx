import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Crown, Lock, ArrowRight } from "lucide-react"
import { BusinessAnalysisLayout } from "../../../components/article/BusinessAnalysisLayout"
import { RelatedPosts } from "@/components/article/RelatedPosts"
import { MdxContent } from "@/components/mdx-content"
import { VipCountdownBanner } from "@/components/vip/VipCountdownBanner"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { getRelatedPosts } from "@/lib/related"
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/booking/admin-auth"
import {
    MEMBER_SESSION_COOKIE,
    verifyMemberSessionToken,
    getMemberFromCookie,
    isVipMember,
    isSessionVip,
} from "@/lib/member/auth"
import { checkResearchVipAccess } from "@/lib/member/vip-access"

interface BusinessPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = await getAllPosts("business")
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: BusinessPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("business", slug)
    if (!post) return {}

    const url = `/business/${slug}`

    return {
        title: post.metadata.title,
        description: post.metadata.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.description,
            type: "article",
            url,
            publishedTime: post.metadata.date,
            modifiedTime: post.metadata.updatedAt,
            tags: post.metadata.tags,
        },
    }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("business", slug)

    if (!post) {
        notFound()
    }

    const cookieStore = await cookies()
    const adminCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    const isAdmin = verifyAdminSession(adminCookie)

    const memberCookie = cookieStore.get(MEMBER_SESSION_COOKIE)?.value
    let isVip = false
    if (memberCookie) {
        try {
            const member = await getMemberFromCookie(memberCookie)
            isVip = isVipMember(member)
        } catch {
            const memberSession = verifyMemberSessionToken(memberCookie)
            isVip = isSessionVip(memberSession)
        }
    }

    const vipCheck = checkResearchVipAccess({
        date: post.metadata.date,
        publishedAt: post.metadata.publishedAt,
        isVip,
        isAdmin,
    })

    const relatedPosts = await getRelatedPosts(post)

    if (vipCheck.isLocked) {
        const match = post.content.match(/^##\s+2\./m)
        let teaserContent = ""
        if (match && typeof match.index === "number" && match.index > 0) {
            teaserContent = post.content.slice(0, match.index).trim()
        } else {
            const secondHeadingMatch = post.content.match(/[\s\S]*?^##\s+[^\n]+\n[\s\S]*?(?=^##\s+)/m)
            if (secondHeadingMatch && secondHeadingMatch[0]) {
                teaserContent = secondHeadingMatch[0].trim()
            } else {
                teaserContent = post.content.slice(0, Math.min(post.content.length, 600)).trim()
            }
        }

        return (
            <BusinessAnalysisLayout meta={post.metadata}>
                <VipCountdownBanner unlockAt={vipCheck.unlockAt} />
                <MdxContent source={teaserContent} />

                <div className="relative my-12 overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/5 via-stone-900/5 to-stone-900/10 dark:from-amber-500/10 dark:via-stone-900/40 dark:to-stone-900/80 p-8 md:p-12 text-center backdrop-blur-md shadow-lg">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 mb-4 shadow-sm">
                        <Lock className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                        Nội dung phân tích chuyên sâu đang được khóa (VIP-First)
                    </h3>

                    <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed font-sans">
                        Các phần phân tích tài chính chi tiết, mô hình định giá, luận điểm đầu tư và điều gì khiến luận điểm sai đang trong thời gian phát hành sớm 8 giờ dành riêng cho hội viên VIP.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/vip/upgrade"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-amber-600 hover:to-rose-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Crown className="h-4 w-4" />
                            <span>Đăng ký thành viên VIP</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
                        >
                            <span>Đăng nhập hội viên</span>
                        </Link>
                    </div>
                </div>

                <RelatedPosts posts={relatedPosts} />
            </BusinessAnalysisLayout>
        )
    }

    return (
        <BusinessAnalysisLayout meta={post.metadata}>
            <MdxContent source={post.content} />
            <RelatedPosts posts={relatedPosts} />
        </BusinessAnalysisLayout>
    )
}
