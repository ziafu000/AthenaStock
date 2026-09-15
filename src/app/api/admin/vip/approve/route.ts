import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { isAdminRequest } from "@/lib/booking/admin-auth"
import { recordAuditLog } from "@/lib/member/audit"
import type { Member, VipPaymentRequest } from "@/lib/member/types"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { requestId, notes } = body

        if (!requestId) {
            return NextResponse.json({ error: "Thiếu mã yêu cầu thanh toán (requestId)." }, { status: 400 })
        }

        const sql = getDatabase()

        const approval = await sql.begin(async (tx) => {
            const reqRows = await tx<VipPaymentRequest[]>`
                SELECT id, member_id, package_id, package_months, amount, transfer_code, status, notes, created_at, approved_at, updated_at
                FROM public.vip_payment_requests
                WHERE id = ${requestId}
                FOR UPDATE
            `

            if (reqRows.length === 0) {
                return { status: 404 as const, error: "Không tìm thấy yêu cầu thanh toán." }
            }

            const vipReq = reqRows[0]
            if (vipReq.status === "approved") {
                return { status: 400 as const, error: "Yêu cầu thanh toán này đã được duyệt trước đó." }
            }

            const memRows = await tx<Member[]>`
                SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                FROM public.members
                WHERE id = ${vipReq.member_id}
                FOR UPDATE
            `

            if (memRows.length === 0) {
                return { status: 404 as const, error: "Không tìm thấy thông tin thành viên." }
            }

            const member = memRows[0]
            const now = new Date()
            const durationMs = vipReq.package_months * 30 * 24 * 60 * 60 * 1000

            let newVipStartedAt: Date
            let newVipExpiresAt: Date

            if (member.tier === "vip" && member.vip_expires_at && new Date(member.vip_expires_at).getTime() > now.getTime()) {
                newVipStartedAt = member.vip_started_at ? new Date(member.vip_started_at) : now
                newVipExpiresAt = new Date(new Date(member.vip_expires_at).getTime() + durationMs)
            } else {
                newVipStartedAt = now
                newVipExpiresAt = new Date(now.getTime() + durationMs)
            }

            await tx`
                UPDATE public.members
                SET tier = 'vip',
                    vip_started_at = ${newVipStartedAt.toISOString()},
                    vip_expires_at = ${newVipExpiresAt.toISOString()},
                    updated_at = now()
                WHERE id = ${member.id}
            `

            await tx`
                UPDATE public.vip_payment_requests
                SET status = 'approved',
                    approved_at = now(),
                    notes = COALESCE(${notes || null}, notes),
                    updated_at = now()
                WHERE id = ${vipReq.id}
            `

            return {
                status: 200 as const,
                vipReq,
                member,
                newVipExpiresAt,
            }
        })

        if ("error" in approval) {
            return NextResponse.json({ error: approval.error }, { status: approval.status })
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin"

        await recordAuditLog({
            actorType: "admin",
            actorId: adminEmail,
            action: "approve_vip",
            targetType: "vip_payment_request",
            targetId: approval.vipReq.id,
            details: {
                memberId: approval.member.id,
                memberEmail: approval.member.email,
                months: approval.vipReq.package_months,
                newExpiresAt: approval.newVipExpiresAt.toISOString(),
                notes: notes || null,
            },
        })

        return NextResponse.json({
            success: true,
            message: `Đã kích hoạt VIP ${approval.vipReq.package_months} tháng cho thành viên ${approval.member.full_name}.`,
            vipExpiresAt: approval.newVipExpiresAt.toISOString(),
        })
    } catch (error) {
        console.error("Approve VIP error:", error)
        return NextResponse.json({ error: "Không thể duyệt yêu cầu VIP." }, { status: 500 })
    }
}
