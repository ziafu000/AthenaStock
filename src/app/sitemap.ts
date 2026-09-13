import type { MetadataRoute } from "next"
import { getAllContent } from "../lib/mdx.ts"
import { getPostUrl } from "../lib/content-types.ts"
import { siteConfig } from "../lib/site.ts"

const staticRoutes = [
    "",
    "/about",
    "/advisory",
    "/articles",
    "/business",
    "/psychology",
    "/frameworks",
    "/series",
    "/library",
    "/library/glossary",
    "/disclaimer",
    "/privacy",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllContent()

    return [
        ...staticRoutes.map((route) => ({
            url: `${siteConfig.url}${route}`,
            changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
            priority: route === "" ? 1 : 0.7,
        })),
        ...posts.map((post) => ({
            url: `${siteConfig.url}${getPostUrl(post.metadata.type, post.slug)}`,
            lastModified: new Date(post.metadata.updatedAt ?? post.metadata.date),
            changeFrequency: "monthly" as const,
            priority: post.metadata.type === "business" ? 0.9 : 0.8,
        })),
    ]
}
