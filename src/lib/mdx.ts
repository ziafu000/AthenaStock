import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { ContentType, Frontmatter, Post } from "./content-types"

const rootDirectory = path.join(process.cwd(), "content")

export async function getPostBySlug(type: ContentType, slug: string): Promise<Post | null> {
    try {
        const filePath = path.join(rootDirectory, type, `${slug}.mdx`)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const { data, content } = matter(fileContent)

        return {
            metadata: { ...data, slug, type } as Frontmatter,
            content,
            slug,
        }
    } catch (error) {
        return null
    }
}

export async function getAllPosts(type: ContentType): Promise<Post[]> {
    try {
        const dirPath = path.join(rootDirectory, type)
        if (!fs.existsSync(dirPath)) return []

        const files = fs.readdirSync(dirPath)

        const posts = files
            .filter((file) => path.extname(file) === ".mdx")
            .map((file) => {
                const createSlug = file.replace(/\.mdx$/, "")
                const filePath = path.join(dirPath, file)
                const fileContent = fs.readFileSync(filePath, "utf8")
                const { data } = matter(fileContent)

                return {
                    metadata: { ...data, slug: createSlug, type } as Frontmatter,
                    content: "", // Don't return content for list
                    slug: createSlug,
                }
            })
            .sort((a, b) =>
                new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
            )

        return posts
    } catch (error) {
        return []
    }
}

export async function getAllContent(): Promise<Post[]> {
    const types: ContentType[] = ["article", "business", "psychology", "framework", "library"]
    let allPosts: Post[] = []

    for (const type of types) {
        const posts = await getAllPosts(type)
        allPosts = [...allPosts, ...posts]
    }

    return allPosts.sort((a, b) =>
        new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    )
}
