import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {
    BUSINESS_MARKETS,
    BUSINESS_SECTION_HEADINGS,
    CONTENT_TYPES,
    FRAMEWORK_DIFFICULTIES,
    RISK_LEVELS,
    getPostUrl,
} from "./content-types.ts"
import type {
    ContentType,
    FrontmatterByType,
    Post,
} from "./content-types.ts"

const rootDirectory = path.join(process.cwd(), "content")
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const readingTimePattern = /^\d+\s*(?:min|phút)$/iu
const forbiddenBusinessPhrases = [
    "mua ngay",
    "bán ngay",
    "canh mua",
    "khuyến nghị mua",
    "khuyến nghị bán",
    "giá mục tiêu",
    "target giá",
    "kèo thơm",
    "đánh theo",
]

const commonFrontmatterKeys = [
    "title",
    "description",
    "date",
    "updatedAt",
    "tags",
    "readingTime",
    "type",
] as const

const typeSpecificFrontmatterKeys: Record<ContentType, readonly string[]> = {
    article: ["series"],
    business: ["citations", "riskLevel", "tickers", "market"],
    psychology: ["relatedBiases"],
    framework: ["difficulty", "downloadable"],
    library: [],
}

export interface ContentValidationIssue {
    field: string
    message: string
}

export class ContentValidationError extends Error {
    readonly filePath: string
    readonly issues: ContentValidationIssue[]

    constructor(filePath: string, issues: ContentValidationIssue[]) {
        const displayPath = toDisplayPath(filePath)
        const details = issues.map(({ field, message }) => `- ${field}: ${message}`).join("\n")
        super(`Invalid content file "${displayPath}":\n${details}`)
        this.name = "ContentValidationError"
        this.filePath = displayPath
        this.issues = issues
    }
}

export interface ContentRepositoryValidationResult {
    files: number
    internalLinks: number
}

function toDisplayPath(filePath: string): string {
    return path.relative(process.cwd(), filePath).replaceAll("\\", "/")
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isValidIsoDate(value: string): boolean {
    if (!isoDatePattern.test(value)) return false

    const [year, month, day] = value.split("-").map(Number)
    const parsed = new Date(Date.UTC(year, month - 1, day))

    return parsed.getUTCFullYear() === year
        && parsed.getUTCMonth() === month - 1
        && parsed.getUTCDate() === day
}

function validateRequiredString(
    data: Record<string, unknown>,
    field: string,
    issues: ContentValidationIssue[],
    maximumLength?: number,
): void {
    const value = data[field]
    if (typeof value !== "string" || value.trim().length === 0) {
        issues.push({ field, message: "must be a non-empty string" })
        return
    }

    if (maximumLength && value.trim().length > maximumLength) {
        issues.push({ field, message: `must be at most ${maximumLength} characters` })
    }
}

function validateOptionalString(
    data: Record<string, unknown>,
    field: string,
    issues: ContentValidationIssue[],
): void {
    const value = data[field]
    if (value !== undefined && (typeof value !== "string" || value.trim().length === 0)) {
        issues.push({ field, message: "must be a non-empty string when provided" })
    }
}

function validateStringArray(
    data: Record<string, unknown>,
    field: string,
    issues: ContentValidationIssue[],
    required: boolean,
): void {
    const value = data[field]
    if (value === undefined && !required) return

    if (!Array.isArray(value) || (required && value.length === 0)) {
        issues.push({ field, message: required ? "must be a non-empty string array" : "must be a string array" })
        return
    }

    if (value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
        issues.push({ field, message: "must contain only non-empty strings" })
        return
    }

    const normalizedValues = value.map((item) => (item as string).trim().toLocaleLowerCase("vi-VN"))
    if (new Set(normalizedValues).size !== normalizedValues.length) {
        issues.push({ field, message: "must not contain duplicates" })
    }
}

function validateDateField(
    data: Record<string, unknown>,
    field: string,
    issues: ContentValidationIssue[],
    required: boolean,
): void {
    const value = data[field]
    if (value === undefined && !required) return

    if (typeof value !== "string" || !isValidIsoDate(value)) {
        issues.push({ field, message: "must be a valid date in YYYY-MM-DD format" })
    }
}

function validateCitations(data: Record<string, unknown>, issues: ContentValidationIssue[]): void {
    const citations = data.citations
    if (!Array.isArray(citations) || citations.length === 0) {
        issues.push({ field: "citations", message: "must contain at least one source" })
        return
    }

    citations.forEach((citation, index) => {
        if (!isPlainObject(citation)) {
            issues.push({ field: `citations[${index}]`, message: "must be an object with label and url" })
            return
        }

        if (typeof citation.label !== "string" || citation.label.trim().length === 0) {
            issues.push({ field: `citations[${index}].label`, message: "must be a non-empty string" })
        }

        if (typeof citation.url !== "string") {
            issues.push({ field: `citations[${index}].url`, message: "must be a valid HTTPS URL" })
            return
        }

        try {
            const parsedUrl = new URL(citation.url)
            if (parsedUrl.protocol !== "https:") {
                issues.push({ field: `citations[${index}].url`, message: "must use HTTPS" })
            }
        } catch {
            issues.push({ field: `citations[${index}].url`, message: "must be a valid HTTPS URL" })
        }
    })
}

function extractLevelTwoHeadings(content: string): string[] {
    const headings: string[] = []
    let fence: "```" | "~~~" | null = null

    for (const line of content.split(/\r?\n/u)) {
        const trimmedLine = line.trimStart()
        if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
            const marker = trimmedLine.slice(0, 3) as "```" | "~~~"
            fence = fence === marker ? null : fence ?? marker
            continue
        }

        if (fence) continue

        const match = /^##(?!#)\s+(?:\d+\.\s*)?(.+?)\s*#*$/u.exec(line)
        if (match) headings.push(match[1].trim())
    }

    return headings
}

function validateBusinessContent(content: string, issues: ContentValidationIssue[]): void {
    const headings = extractLevelTwoHeadings(content)

    if (headings.length !== BUSINESS_SECTION_HEADINGS.length) {
        issues.push({
            field: "content.sections",
            message: `must contain exactly ${BUSINESS_SECTION_HEADINGS.length} level-two sections; found ${headings.length}`,
        })
    }

    BUSINESS_SECTION_HEADINGS.forEach((expectedHeading, index) => {
        if (headings[index] !== expectedHeading) {
            issues.push({
                field: `content.sections[${index + 1}]`,
                message: `expected "${expectedHeading}"${headings[index] ? `, found "${headings[index]}"` : ""}`,
            })
        }
    })

    const normalizedContent = content.toLocaleLowerCase("vi-VN")
    for (const phrase of forbiddenBusinessPhrases) {
        if (normalizedContent.includes(phrase)) {
            issues.push({
                field: "content.language",
                message: `must not contain recommendation language "${phrase}"`,
            })
        }
    }
}

export function validateFrontmatter<T extends ContentType>(
    expectedType: T,
    slug: string,
    data: unknown,
    content: string,
    filePath: string,
): FrontmatterByType[T] {
    const issues: ContentValidationIssue[] = []

    if (!isPlainObject(data)) {
        throw new ContentValidationError(filePath, [
            { field: "frontmatter", message: "must be a YAML object" },
        ])
    }

    if (!slugPattern.test(slug)) {
        issues.push({ field: "slug", message: "filename must use lowercase kebab-case" })
    }

    validateRequiredString(data, "title", issues, 120)
    validateRequiredString(data, "description", issues, 180)
    validateDateField(data, "date", issues, true)
    validateDateField(data, "updatedAt", issues, false)
    validateStringArray(data, "tags", issues, true)
    validateRequiredString(data, "readingTime", issues)

    if (typeof data.readingTime === "string" && !readingTimePattern.test(data.readingTime.trim())) {
        issues.push({ field: "readingTime", message: "must use a value such as \"5 min\" or \"5 phút\"" })
    }

    if (data.type !== expectedType) {
        issues.push({ field: "type", message: `must be "${expectedType}" to match its content directory` })
    }

    const allowedKeys = new Set<string>([
        ...commonFrontmatterKeys,
        ...typeSpecificFrontmatterKeys[expectedType],
    ])
    for (const key of Object.keys(data)) {
        if (!allowedKeys.has(key)) {
            issues.push({ field: key, message: `is not supported for content type "${expectedType}"` })
        }
    }

    switch (expectedType) {
        case "article":
            validateOptionalString(data, "series", issues)
            break
        case "business": {
            validateDateField(data, "updatedAt", issues, true)
            validateStringArray(data, "tickers", issues, true)
            validateCitations(data, issues)

            if (!BUSINESS_MARKETS.includes(data.market as (typeof BUSINESS_MARKETS)[number])) {
                issues.push({ field: "market", message: `must be one of: ${BUSINESS_MARKETS.join(", ")}` })
            }
            if (!RISK_LEVELS.includes(data.riskLevel as (typeof RISK_LEVELS)[number])) {
                issues.push({ field: "riskLevel", message: `must be one of: ${RISK_LEVELS.join(", ")}` })
            }
            if (
                typeof data.date === "string"
                && typeof data.updatedAt === "string"
                && isValidIsoDate(data.date)
                && isValidIsoDate(data.updatedAt)
                && data.updatedAt < data.date
            ) {
                issues.push({ field: "updatedAt", message: "must not be earlier than date" })
            }

            validateBusinessContent(content, issues)
            break
        }
        case "psychology":
            validateStringArray(data, "relatedBiases", issues, false)
            break
        case "framework":
            if (
                data.difficulty !== undefined
                && !FRAMEWORK_DIFFICULTIES.includes(data.difficulty as (typeof FRAMEWORK_DIFFICULTIES)[number])
            ) {
                issues.push({
                    field: "difficulty",
                    message: `must be one of: ${FRAMEWORK_DIFFICULTIES.join(", ")}`,
                })
            }
            if (data.downloadable !== undefined && typeof data.downloadable !== "boolean") {
                issues.push({ field: "downloadable", message: "must be a boolean" })
            }
            break
        case "library":
            break
    }

    if (content.trim().length === 0) {
        issues.push({ field: "content", message: "must not be empty" })
    }

    if (issues.length > 0) {
        throw new ContentValidationError(filePath, issues)
    }

    return { ...data, slug, type: expectedType } as unknown as FrontmatterByType[T]
}

function parseContentFile<T extends ContentType>(type: T, filePath: string, includeContent: boolean): Post<T> {
    const slug = path.basename(filePath, ".mdx")
    let parsed: matter.GrayMatterFile<string>

    try {
        parsed = matter(fs.readFileSync(filePath, "utf8"))
    } catch (error) {
        throw new ContentValidationError(filePath, [
            {
                field: "frontmatter",
                message: error instanceof Error ? error.message : "could not be parsed",
            },
        ])
    }

    return {
        metadata: validateFrontmatter(type, slug, parsed.data, parsed.content, filePath),
        content: includeContent ? parsed.content : "",
        slug,
    }
}

export async function getPostBySlug<T extends ContentType>(type: T, slug: string): Promise<Post<T> | null> {
    if (!slugPattern.test(slug)) return null

    const filePath = path.join(rootDirectory, type, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    return parseContentFile(type, filePath, true)
}

export async function getAllPosts<T extends ContentType>(type: T): Promise<Post<T>[]> {
    const dirPath = path.join(rootDirectory, type)
    if (!fs.existsSync(dirPath)) return []

    return fs.readdirSync(dirPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && path.extname(entry.name) === ".mdx")
        .map((entry) => parseContentFile(type, path.join(dirPath, entry.name), false))
        .sort(comparePosts)
}

function comparePosts(a: Post, b: Post): number {
    const dateDifference = b.metadata.date.localeCompare(a.metadata.date)
    if (dateDifference !== 0) return dateDifference

    const typeDifference = a.metadata.type.localeCompare(b.metadata.type)
    if (typeDifference !== 0) return typeDifference

    return a.slug.localeCompare(b.slug, "vi")
}

export async function getAllContent(): Promise<Post[]> {
    const allPosts: Post[] = []

    for (const type of CONTENT_TYPES) {
        const posts = await getAllPosts(type)
        allPosts.push(...posts)
    }

    return allPosts.sort(comparePosts)
}

function getStaticAppRoutes(): Set<string> {
    const appDirectory = path.join(process.cwd(), "src", "app")
    const routes = new Set<string>(["/"])
    if (!fs.existsSync(appDirectory)) return routes

    const pageFiles: string[] = []
    const visit = (directory: string): void => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name)
            if (entry.isDirectory()) visit(entryPath)
            if (entry.isFile() && /^page\.(?:ts|tsx|js|jsx)$/u.test(entry.name)) pageFiles.push(entryPath)
        }
    }
    visit(appDirectory)

    for (const pageFile of pageFiles) {
        const relativeDirectory = path.relative(appDirectory, path.dirname(pageFile))
        const segments = relativeDirectory
            .split(path.sep)
            .filter(Boolean)
            .filter((segment) => !segment.startsWith("(") && !segment.startsWith("@"))

        if (segments.some((segment) => segment.startsWith("["))) continue
        routes.add(normalizeRoute(`/${segments.join("/")}`))
    }

    return routes
}

function normalizeRoute(route: string): string {
    if (route === "") return "/"
    return route.length > 1 ? route.replace(/\/+$/u, "") : route
}

function extractInternalLinkTargets(content: string): string[] {
    const targets: string[] = []
    const markdownLinkPattern = /(?<!!)\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/gu
    const attributeLinkPattern = /\b(?:href|src)=["']([^"']+)["']/gu

    for (const match of content.matchAll(markdownLinkPattern)) targets.push(match[1])
    for (const match of content.matchAll(attributeLinkPattern)) targets.push(match[1])

    return [...new Set(targets)]
}

function validateInternalLinkTarget(
    target: string,
    routes: Set<string>,
    filePath: string,
    index: number,
): ContentValidationIssue | null {
    if (
        target.startsWith("#")
        || target.startsWith("mailto:")
        || target.startsWith("tel:")
        || target.startsWith("https://")
        || target.startsWith("http://")
        || target.startsWith("//")
    ) {
        return null
    }

    const field = `content.links[${index + 1}]`
    if (!target.startsWith("/")) {
        return { field, message: `internal link "${target}" must be root-relative` }
    }

    let pathname: string
    try {
        pathname = decodeURIComponent(new URL(target, "https://athenastock.local").pathname)
    } catch {
        return { field, message: `link "${target}" is malformed` }
    }

    const normalizedTarget = normalizeRoute(pathname)
    const publicPath = path.join(process.cwd(), "public", pathname.replace(/^\/+/, ""))
    const targetExists = routes.has(normalizedTarget) || fs.existsSync(publicPath)

    if (!targetExists) {
        return {
            field,
            message: `link "${target}" does not resolve to a page or public asset (from ${toDisplayPath(filePath)})`,
        }
    }

    return null
}

export async function validateContentRepository(): Promise<ContentRepositoryValidationResult> {
    const routes = getStaticAppRoutes()
    const records: Array<{ filePath: string; post: Post }> = []
    const errors: string[] = []

    for (const type of CONTENT_TYPES) {
        const directory = path.join(rootDirectory, type)
        if (!fs.existsSync(directory)) continue

        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            if (!entry.isFile() || path.extname(entry.name) !== ".mdx") continue

            const filePath = path.join(directory, entry.name)
            try {
                const post = parseContentFile(type, filePath, true)
                records.push({ filePath, post })
                routes.add(getPostUrl(type, post.slug))
            } catch (error) {
                errors.push(error instanceof Error ? error.message : String(error))
            }
        }
    }

    let internalLinks = 0
    for (const { filePath, post } of records) {
        const targets = extractInternalLinkTargets(post.content)
        internalLinks += targets.length
        const issues = targets
            .map((target, index) => validateInternalLinkTarget(target, routes, filePath, index))
            .filter((issue): issue is ContentValidationIssue => issue !== null)

        if (issues.length > 0) errors.push(new ContentValidationError(filePath, issues).message)
    }

    if (errors.length > 0) {
        throw new Error(`Content validation failed:\n\n${errors.join("\n\n")}`)
    }

    return { files: records.length, internalLinks }
}
