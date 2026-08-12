import { getAllContent } from "@/lib/mdx"
import type { Post } from "@/lib/content-types"

export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
    if (limit <= 0) return []

    const allPosts = await getAllContent()
    const currentTags = new Set(
        currentPost.metadata.tags.map((tag) => tag.trim().toLocaleLowerCase("vi-VN")),
    )

    return allPosts
        .filter((post) => post.slug !== currentPost.slug || post.metadata.type !== currentPost.metadata.type)
        .map((post) => {
            const sharedTags = post.metadata.tags.filter((tag) => (
                currentTags.has(tag.trim().toLocaleLowerCase("vi-VN"))
            )).length
            const sameType = post.metadata.type === currentPost.metadata.type ? 1 : 0

            return {
                post,
                score: sharedTags * 3 + sameType,
            }
        })
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score

            const dateDifference = b.post.metadata.date.localeCompare(a.post.metadata.date)
            if (dateDifference !== 0) return dateDifference

            const typeDifference = a.post.metadata.type.localeCompare(b.post.metadata.type)
            if (typeDifference !== 0) return typeDifference

            return a.post.slug.localeCompare(b.post.slug, "vi")
        })
        .slice(0, limit)
        .map(({ post }) => post)
}
