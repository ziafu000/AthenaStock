import { NextRequest, NextResponse } from "next/server"
import { getAllContent } from "@/lib/mdx"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get("q") || ""
        const query = q.trim().toLocaleLowerCase("vi-VN")
        
        const posts = await getAllContent()
        
        if (!query) {
            return NextResponse.json([])
        }
        
        const results = posts.filter((post) => {
            const searchableText = [
                post.metadata.title,
                post.metadata.description,
                post.metadata.type,
                ...(post.metadata.tags ?? []),
                ...(post.metadata.tickers ?? []),
            ]
                .join(" ")
                .toLocaleLowerCase("vi-VN")

            return searchableText.includes(query)
        })
        
        return NextResponse.json(results)
    } catch (error) {
        console.error("Search API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
