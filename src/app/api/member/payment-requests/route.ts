import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { getMemberFromRequest } from "@/lib/member/auth"
import type { VipPaymentRequest } from "@/lib/member/types"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 })
        }

        const sql = getDatabase()
        const requests = await sql<VipPaymentRequest[]>`
            SELECT id, member_id, package_id, package_months, amount, transfer_code, bank_info, status, proof_image_data, notes, created_at, approved_at, updated_at
            FROM public.vip_payment_requests
            WHERE member_id = ${member.id}
            ORDER BY created_at DESC
        `

        return NextResponse.json({ requests }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Get member payment requests error:", error)
        return NextResponse.json({ error: "Không thể tải lịch sử thanh toán." }, { status: 500 })
    }
}
