import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { getMemberFromRequest, isVipMember } from "@/lib/member/auth"
import type { PortfolioHolding, PortfolioHoldingWithMetrics, PortfolioSummary } from "@/lib/member/types"

export const runtime = "nodejs"

// Reference mock prices for common VN stocks (in VND) for portfolio calculation
const REFERENCE_PRICES: Record<string, number> = {
    FPT: 135000,
    HPG: 26800,
    VNM: 67500,
    MWG: 61800,
    VCB: 92400,
    TCB: 23900,
    MBB: 24200,
    ACB: 25100,
    MSN: 73200,
    VIC: 41800,
    VHM: 41200,
    SSI: 32500,
    VND: 15400,
    DGC: 114000,
    FRT: 172000,
    PNJ: 98000,
    REE: 64500,
}

function getMarketPrice(ticker: string, costBasis: number): number {
    const symbol = ticker.trim().toUpperCase()
    if (REFERENCE_PRICES[symbol]) {
        return REFERENCE_PRICES[symbol]
    }
    // Default fallback to cost_basis if not in reference list
    return costBasis
}

export async function GET(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 })
        }

        if (!isVipMember(member)) {
            return NextResponse.json({
                error: "Tính năng Portfolio cá nhân chỉ dành riêng cho thành viên VIP. Vui lòng nâng cấp tài khoản để sử dụng.",
                isVipRequired: true,
            }, { status: 403 })
        }

        const sql = getDatabase()
        const rows = await sql<PortfolioHolding[]>`
            SELECT id, member_id, ticker, shares, cost_basis, notes, created_at, updated_at
            FROM public.portfolio_holdings
            WHERE member_id = ${member.id}
            ORDER BY updated_at DESC
        `

        let totalCost = 0
        let totalMarketValue = 0

        const calculatedHoldings = rows.map((h) => {
            const shares = Number(h.shares)
            const costBasis = Number(h.cost_basis)
            const marketPrice = getMarketPrice(h.ticker, costBasis)
            const holdingCost = shares * costBasis
            const holdingMarketValue = shares * marketPrice
            const gainLoss = holdingMarketValue - holdingCost
            const gainLossPercent = holdingCost > 0 ? (gainLoss / holdingCost) * 100 : 0

            totalCost += holdingCost
            totalMarketValue += holdingMarketValue

            return {
                ...h,
                shares,
                cost_basis: costBasis,
                market_price: marketPrice,
                total_cost: holdingCost,
                market_value: holdingMarketValue,
                gain_loss: gainLoss,
                gain_loss_percent: gainLossPercent,
                weight: 0,
            }
        })

        // Compute weights
        const holdingsWithWeights: PortfolioHoldingWithMetrics[] = calculatedHoldings.map((h) => ({
            ...h,
            weight: totalMarketValue > 0 ? (h.market_value / totalMarketValue) * 100 : 0,
        }))

        const totalGainLoss = totalMarketValue - totalCost
        const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

        const summary: PortfolioSummary = {
            total_cost: totalCost,
            total_market_value: totalMarketValue,
            total_gain_loss: totalGainLoss,
            total_gain_loss_percent: totalGainLossPercent,
            holdings: holdingsWithWeights,
        }

        return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Get portfolio error:", error)
        return NextResponse.json({ error: "Không thể tải danh mục đầu tư." }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 })
        }

        if (!isVipMember(member)) {
            return NextResponse.json({
                error: "Tính năng Portfolio cá nhân chỉ dành riêng cho thành viên VIP.",
                isVipRequired: true,
            }, { status: 403 })
        }

        const body = await request.json()
        const ticker = typeof body.ticker === "string" ? body.ticker.trim().toUpperCase() : ""
        const shares = Number(body.shares)
        const costBasis = Number(body.cost_basis)
        const notes = typeof body.notes === "string" ? body.notes.trim() : null

        if (!ticker || ticker.length < 2 || ticker.length > 10) {
            return NextResponse.json({ error: "Mã cổ phiếu không hợp lệ." }, { status: 400 })
        }
        if (isNaN(shares) || shares <= 0) {
            return NextResponse.json({ error: "Số lượng cổ phiếu phải lớn hơn 0." }, { status: 400 })
        }
        if (isNaN(costBasis) || costBasis < 0) {
            return NextResponse.json({ error: "Giá vốn không hợp lệ." }, { status: 400 })
        }

        const sql = getDatabase()

        const upserted = await sql<PortfolioHolding[]>`
            INSERT INTO public.portfolio_holdings (
                member_id, ticker, shares, cost_basis, notes, updated_at
            ) VALUES (
                ${member.id}, ${ticker}, ${shares}, ${costBasis}, ${notes}, now()
            )
            ON CONFLICT (member_id, (upper(ticker)))
            DO UPDATE SET
                shares = EXCLUDED.shares,
                cost_basis = EXCLUDED.cost_basis,
                notes = COALESCE(EXCLUDED.notes, portfolio_holdings.notes),
                updated_at = now()
            RETURNING id, member_id, ticker, shares, cost_basis, notes, created_at, updated_at
        `

        return NextResponse.json({
            success: true,
            holding: upserted[0],
        })
    } catch (error) {
        console.error("Save portfolio holding error:", error)
        return NextResponse.json({ error: "Không thể lưu cổ phiếu vào danh mục." }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 })
        }

        if (!isVipMember(member)) {
            return NextResponse.json({ error: "Yêu cầu quyền thành viên VIP." }, { status: 403 })
        }

        const url = new URL(request.url)
        const ticker = url.searchParams.get("ticker")?.trim().toUpperCase()

        if (!ticker) {
            return NextResponse.json({ error: "Cần cung cấp mã cổ phiếu để xóa." }, { status: 400 })
        }

        const sql = getDatabase()
        await sql`
            DELETE FROM public.portfolio_holdings
            WHERE upper(ticker) = ${ticker} AND member_id = ${member.id}
        `

        return NextResponse.json({ success: true, message: "Đã xóa khỏi danh mục đầu tư." })
    } catch (error) {
        console.error("Delete portfolio holding error:", error)
        return NextResponse.json({ error: "Không thể xóa cổ phiếu khỏi danh mục." }, { status: 500 })
    }
}
