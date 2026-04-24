import { getAllContent } from "@/lib/mdx"
import { Post } from "@/lib/content-types"

export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
    const allPosts = await getAllContent()
    const currentTags = new Set(currentPost.metadata.tags ?? [])

    return allPosts
        .filter((post) => post.slug !== currentPost.slug || post.metadata.type !== currentPost.metadata.type)
        .map((post) => {
            const sharedTags = (post.metadata.tags ?? []).filter((tag) => currentTags.has(tag)).length
            const sameType = post.metadata.type === currentPost.metadata.type ? 1 : 0

            return {
                post,
                score: sharedTags * 3 + sameType,
            }
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score
            return new Date(b.post.metadata.date).getTime() - new Date(a.post.metadata.date).getTime()
        })
        .slice(0, limit)
        .map(({ post }) => post)
}
