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
