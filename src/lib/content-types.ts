export type ContentType =
    | "article"
    | "business"
    | "psychology"
    | "framework"
    | "library"

export type RiskLevel = "low" | "medium" | "high"

export interface Citation {
    label: string
    url: string
}

export interface Frontmatter {
    title: string
    description: string
    date: string
    updatedAt?: string
    tags?: string[]
    series?: string
    readingTime?: string
    type: ContentType
    citations?: Citation[]
    riskLevel?: RiskLevel
    tickers?: string[]
    market?: string
    slug: string
}

export interface Post {
    metadata: Frontmatter
    content: string
    slug: string
}

export const contentTypePathMap: Record<ContentType, string> = {
    article: "articles",
    business: "business",
    psychology: "psychology",
    framework: "frameworks",
    library: "library",
}

export const contentTypeLabelMap: Record<ContentType, string> = {
    article: "Bài viết",
    business: "Doanh nghiệp",
    psychology: "Tâm lý",
    framework: "Framework",
    library: "Thư viện",
}

export function getPostUrl(type: ContentType, slug: string): string {
    return `/${contentTypePathMap[type]}/${slug}`
}

export function getTypeLabel(type: ContentType): string {
    return contentTypeLabelMap[type]
}
