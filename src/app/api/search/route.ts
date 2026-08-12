import { NextRequest, NextResponse } from "next/server"
import { assertRateLimit, getClientAddress, RateLimitError } from "@/lib/booking/rate-limit"
import { getAllContent } from "@/lib/mdx"

const MAX_QUERY_LENGTH = 80
const MAX_RESULTS = 20
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400"

export async function GET(request: NextRequest) {
    try {
        await assertRateLimit("search-ip", getClientAddress(request), 60, 60)
        const rawQuery = request.nextUrl.searchParams.get("q") || ""
        const trimmed = rawQuery.trim()
        if (trimmed.length > MAX_QUERY_LENGTH) {
            return NextResponse.json({ error: "Từ khóa tìm kiếm quá dài." }, { status: 400 })
        }
        if (!trimmed) {
            return NextResponse.json([], { headers: { "Cache-Control": CACHE_CONTROL } })
        }

        const query = trimmed.toLocaleLowerCase("vi-VN")
        const posts = await getAllContent()
        const results = posts
            .filter((post) => {
                const tickers = post.metadata.type === "business" ? post.metadata.tickers : []
                return [
                    post.metadata.title,
                    post.metadata.description,
                    post.metadata.type,
                    ...post.metadata.tags,
                    ...tickers,
                ].join(" ").toLocaleLowerCase("vi-VN").includes(query)
            })
            .slice(0, MAX_RESULTS)
            .map((post) => ({
                slug: post.slug,
                metadata: {
                    title: post.metadata.title,
                    description: post.metadata.description,
                    type: post.metadata.type,
                    date: post.metadata.date,
                    tags: post.metadata.tags,
                    ...(post.metadata.type === "business" ? { tickers: post.metadata.tickers } : {}),
                },
            }))

        return NextResponse.json(results, { headers: { "Cache-Control": CACHE_CONTROL } })
    } catch (error) {
        console.error("Search request failed:", error)
        if (error instanceof RateLimitError) {
            return NextResponse.json(
                { error: error.message },
                { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } },
            )
        }
        return NextResponse.json({ error: "Hệ thống tìm kiếm đang tạm thời gián đoạn." }, { status: 503 })
    }
}
