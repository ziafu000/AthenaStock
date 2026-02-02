import { BusinessAnalysisLayout } from "../../../components/article/BusinessAnalysisLayout"
import { MdxContent } from "@/components/mdx-content"
import { getAllPosts, getPostBySlug } from "@/lib/mdx"
import { notFound } from "next/navigation"

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
    return {
        title: post.metadata.title,
        description: post.metadata.description,
    }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
    const { slug } = await params
    const post = await getPostBySlug("business", slug)

    if (!post) {
        notFound()
    }

    return (
        <BusinessAnalysisLayout meta={post.metadata}>
            <MdxContent source={post.content} />
        </BusinessAnalysisLayout>
    )
}
