import { ArticleLayout } from "@/components/article/ArticleLayout"
import { MdxContent } from "@/components/mdx-content"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
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
    return {
        title: post.metadata.title,
        description: post.metadata.description,
    }
}

export default async function FrameworkPage({ params }: FrameworkPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("framework", slug)

    if (!post) {
        notFound()
    }

    return (
        <ArticleLayout meta={post.metadata}>
            <MdxContent source={post.content} />
        </ArticleLayout>
    )
}
