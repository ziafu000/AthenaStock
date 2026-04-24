import { ArticleLayout } from "@/components/article/ArticleLayout"
import { RelatedPosts } from "@/components/article/RelatedPosts"
import { MdxContent } from "@/components/mdx-content"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { getRelatedPosts } from "@/lib/related"
import { notFound } from "next/navigation"

interface FrameworkPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = await getAllPosts("framework")
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: FrameworkPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("framework", slug)
    if (!post) return {}

    const url = `/frameworks/${slug}`

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

export default async function FrameworkPage({ params }: FrameworkPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("framework", slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = await getRelatedPosts(post)

    return (
        <ArticleLayout meta={post.metadata}>
            <MdxContent source={post.content} />
            <RelatedPosts posts={relatedPosts} />
        </ArticleLayout>
    )
}
