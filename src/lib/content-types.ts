export const CONTENT_TYPES = [
    "article",
    "business",
    "psychology",
    "framework",
    "library",
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]

export const RISK_LEVELS = ["low", "medium", "high"] as const
export type RiskLevel = (typeof RISK_LEVELS)[number]

export const BUSINESS_MARKETS = ["HOSE", "HNX", "UPCOM"] as const
export type BusinessMarket = (typeof BUSINESS_MARKETS)[number]

export const FRAMEWORK_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const
export type FrameworkDifficulty = (typeof FRAMEWORK_DIFFICULTIES)[number]

export const BUSINESS_SECTION_HEADINGS = [
    "Tổng quan",
    "Mô hình kinh doanh",
    "Lợi thế cạnh tranh",
    "Ban lãnh đạo",
    "Chất lượng tài chính",
    "Động lực tăng trưởng",
    "Rủi ro",
    "Định giá",
    "Biên an toàn",
    "Luận điểm đầu tư",
    "Điều gì khiến luận điểm sai",
    "Ngày cập nhật nghiên cứu",
] as const

export type BusinessSectionHeading = (typeof BUSINESS_SECTION_HEADINGS)[number]

export interface Citation {
    label: string
    url: string
}

interface BaseFrontmatter {
    title: string
    description: string
    date: string
    updatedAt?: string
    tags: string[]
    readingTime: string
    slug: string
}

export interface ArticleFrontmatter extends BaseFrontmatter {
    type: "article"
    series?: string
}

export interface BusinessFrontmatter extends BaseFrontmatter {
    type: "business"
    updatedAt: string
    citations: Citation[]
    riskLevel: RiskLevel
    tickers: string[]
    market: BusinessMarket
}

export interface PsychologyFrontmatter extends BaseFrontmatter {
    type: "psychology"
    relatedBiases?: string[]
}

export interface FrameworkFrontmatter extends BaseFrontmatter {
    type: "framework"
    difficulty?: FrameworkDifficulty
    downloadable?: boolean
}

export interface LibraryFrontmatter extends BaseFrontmatter {
    type: "library"
}

export interface FrontmatterByType {
    article: ArticleFrontmatter
    business: BusinessFrontmatter
    psychology: PsychologyFrontmatter
    framework: FrameworkFrontmatter
    library: LibraryFrontmatter
}

export type Frontmatter = FrontmatterByType[ContentType]

export interface Post<T extends ContentType = ContentType> {
    metadata: FrontmatterByType[T]
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
