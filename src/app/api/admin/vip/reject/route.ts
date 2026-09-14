import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { isAdminRequest } from "@/lib/booking/admin-auth"
import { recordAuditLog } from "@/lib/member/audit"
import type { VipPaymentRequest } from "@/lib/member/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { requestId, status, reason } = body

        if (!requestId) {
            return NextResponse.json({ error: "Thiếu mã yêu cầu thanh toán (requestId)." }, { status: 400 })
        }

        const validStatuses = ["rejected", "more_info_needed"]
        const targetStatus = validStatuses.includes(status) ? status : "rejected"

        const sql = getDatabase()

        const reqRows = await sql<VipPaymentRequest[]>`
            SELECT id, member_id, status FROM public.vip_payment_requests WHERE id = ${requestId} LIMIT 1
        `

        if (reqRows.length === 0) {
            return NextResponse.json({ error: "Không tìm thấy yêu cầu thanh toán." }, { status: 404 })
        }

        const currentReq = reqRows[0]

        if (currentReq.status === "approved") {
            return NextResponse.json({ error: "Không thể từ chối yêu cầu thanh toán đã được phê duyệt." }, { status: 400 })
        }

        await sql`
            UPDATE public.vip_payment_requests
            SET status = ${targetStatus},
                notes = ${reason || null},
                updated_at = now()
            WHERE id = ${requestId}
        `

        const adminEmail = process.env.ADMIN_EMAIL || "admin"

        await recordAuditLog({
            actorType: "admin",
            actorId: adminEmail,
            action: targetStatus === "rejected" ? "reject_vip" : "request_more_info_vip",
            targetType: "vip_payment_request",
            targetId: requestId,
            details: {
                memberId: currentReq.member_id,
                status: targetStatus,
                reason: reason || null,
            },
        })

        return NextResponse.json({
            success: true,
            message: targetStatus === "rejected" ? "Đã từ chối yêu cầu thanh toán." : "Đã chuyển trạng thái yêu cầu bổ sung thông tin.",
        })
    } catch (error) {
        console.error("Reject VIP error:", error)
        return NextResponse.json({ error: "Không thể xử lý yêu cầu." }, { status: 500 })
    }
}
