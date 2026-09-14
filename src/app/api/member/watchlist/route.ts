import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { getMemberFromRequest } from "@/lib/member/auth"
import { WATCHLIST_STATUSES } from "@/lib/member/types"
import type { WatchlistItem, WatchlistStatus } from "@/lib/member/types"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập để xem Watchlist." }, { status: 401 })
        }

        const sql = getDatabase()
        const items = await sql<WatchlistItem[]>`
            SELECT id, member_id, ticker, status, notes, created_at, updated_at
            FROM public.watchlists
            WHERE member_id = ${member.id}
            ORDER BY updated_at DESC
        `

        return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Get watchlist error:", error)
        return NextResponse.json({ error: "Không thể tải Watchlist." }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập để cập nhật Watchlist." }, { status: 401 })
        }

        const body = await request.json()
        const ticker = typeof body.ticker === "string" ? body.ticker.trim().toUpperCase() : ""
        const status = body.status as WatchlistStatus
        const notes = typeof body.notes === "string" ? body.notes.trim() : null

        if (!ticker || ticker.length < 2 || ticker.length > 10) {
            return NextResponse.json({ error: "Mã cổ phiếu không hợp lệ (2-10 ký tự)." }, { status: 400 })
        }

        const validStatus = WATCHLIST_STATUSES.includes(status) ? status : "Đang theo dõi"

        const sql = getDatabase()

        const upserted = await sql<WatchlistItem[]>`
            INSERT INTO public.watchlists (
                member_id, ticker, status, notes, updated_at
            ) VALUES (
                ${member.id}, ${ticker}, ${validStatus}, ${notes}, now()
            )
            ON CONFLICT (member_id, (upper(ticker)))
            DO UPDATE SET
                status = EXCLUDED.status,
                notes = COALESCE(EXCLUDED.notes, watchlists.notes),
                updated_at = now()
            RETURNING id, member_id, ticker, status, notes, created_at, updated_at
        `

        return NextResponse.json({
            success: true,
            item: upserted[0],
        })
    } catch (error) {
        console.error("Save watchlist item error:", error)
        return NextResponse.json({ error: "Không thể lưu mã theo dõi." }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 })
        }

        const url = new URL(request.url)
        let ticker = url.searchParams.get("ticker")
        let id = url.searchParams.get("id")

        if (!ticker && !id) {
            try {
                const body = await request.json()
                ticker = body.ticker
                id = body.id
            } catch {
                // Ignore json parsing error
            }
        }

        const sql = getDatabase()

        if (id) {
            await sql`
                DELETE FROM public.watchlists
                WHERE id = ${id} AND member_id = ${member.id}
            `
        } else if (ticker) {
            await sql`
                DELETE FROM public.watchlists
                WHERE upper(ticker) = ${ticker.trim().toUpperCase()} AND member_id = ${member.id}
            `
        } else {
            return NextResponse.json({ error: "Cần cung cấp mã cổ phiếu hoặc id để xóa." }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: "Đã xóa khỏi danh sách theo dõi." })
    } catch (error) {
        console.error("Delete watchlist item error:", error)
        return NextResponse.json({ error: "Không thể xóa mã theo dõi." }, { status: 500 })
    }
}
