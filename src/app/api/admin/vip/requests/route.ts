import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { isAdminRequest } from "@/lib/booking/admin-auth"
import type { VipPaymentRequest, MembershipAuditLog } from "@/lib/member/types"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 401 })
    }

    try {
        const sql = getDatabase()
        const url = new URL(request.url)
        const statusFilter = url.searchParams.get("status")

        let requests: (VipPaymentRequest & {
            member_name: string
            member_email: string
            member_phone: string | null
            current_tier: string
            member_vip_expires_at: string | null
        })[]

        if (statusFilter && statusFilter !== "all") {
            requests = await sql`
                SELECT 
                    r.id, r.member_id, r.package_id, r.package_months, r.amount, r.transfer_code,
                    r.bank_info, r.status, r.proof_image_data, r.notes, r.created_at, r.approved_at, r.updated_at,
                    m.full_name as member_name, m.email as member_email, m.phone as member_phone,
                    m.tier as current_tier, m.vip_expires_at as member_vip_expires_at
                FROM public.vip_payment_requests r
                JOIN public.members m ON r.member_id = m.id
                WHERE r.status = ${statusFilter}
                ORDER BY r.created_at DESC
                LIMIT 200
            `
        } else {
            requests = await sql`
                SELECT 
                    r.id, r.member_id, r.package_id, r.package_months, r.amount, r.transfer_code,
                    r.bank_info, r.status, r.proof_image_data, r.notes, r.created_at, r.approved_at, r.updated_at,
                    m.full_name as member_name, m.email as member_email, m.phone as member_phone,
                    m.tier as current_tier, m.vip_expires_at as member_vip_expires_at
                FROM public.vip_payment_requests r
                JOIN public.members m ON r.member_id = m.id
                ORDER BY r.created_at DESC
                LIMIT 200
            `
        }

        // Stats summary
        const counts = await sql<{
            total_pending: string
            total_approved: string
            total_rejected: string
            total_more_info: string
            total_members: string
            total_vip: string
        }[]>`
            SELECT
                COUNT(*) FILTER (WHERE status = 'pending') as total_pending,
                COUNT(*) FILTER (WHERE status = 'approved') as total_approved,
                COUNT(*) FILTER (WHERE status = 'rejected') as total_rejected,
                COUNT(*) FILTER (WHERE status = 'more_info_needed') as total_more_info,
                (SELECT COUNT(*) FROM public.members) as total_members,
                (SELECT COUNT(*) FROM public.members WHERE tier = 'vip') as total_vip
            FROM public.vip_payment_requests
        `

        // Recent audit logs
        const auditLogs = await sql<MembershipAuditLog[]>`
            SELECT id, actor_type, actor_id, action, target_type, target_id, details, created_at
            FROM public.membership_audit_logs
            ORDER BY created_at DESC
            LIMIT 30
        `

        return NextResponse.json({
            requests,
            stats: {
                pending: Number(counts[0]?.total_pending || 0),
                approved: Number(counts[0]?.total_approved || 0),
                rejected: Number(counts[0]?.total_rejected || 0),
                moreInfoNeeded: Number(counts[0]?.total_more_info || 0),
                totalMembers: Number(counts[0]?.total_members || 0),
                vipMembers: Number(counts[0]?.total_vip || 0),
            },
            auditLogs,
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Admin VIP requests error:", error)
        return NextResponse.json({ error: "Không thể tải danh sách yêu cầu VIP." }, { status: 500 })
    }
}
