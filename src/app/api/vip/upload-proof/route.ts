import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { getMemberFromRequest, verifyUploadProofToken } from "@/lib/member/auth"
import { recordAuditLog } from "@/lib/member/audit"
import type { VipPaymentRequest } from "@/lib/member/types"

export const runtime = "nodejs"

const MAX_BASE64_LENGTH = 7 * 1024 * 1024 // ~5MB file in base64

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const requestId = typeof body.requestId === "string" ? body.requestId.trim() : ""
        const proofImageData = typeof body.proofImageData === "string" ? body.proofImageData : ""
        const uploadToken = typeof body.uploadToken === "string" ? body.uploadToken : ""

        if (!requestId) {
            return NextResponse.json({ error: "Thiếu mã yêu cầu thanh toán (requestId)." }, { status: 400 })
        }

        if (!proofImageData) {
            return NextResponse.json({ error: "Vui lòng chọn hoặc tải lên hình ảnh biên lai thanh toán." }, { status: 400 })
        }

        if (proofImageData.length > MAX_BASE64_LENGTH) {
            return NextResponse.json({ error: "Dung lượng hình ảnh vượt quá giới hạn 5MB." }, { status: 400 })
        }

        const mimeMatch = proofImageData.match(/^data:(image\/(jpeg|png|webp|gif|heic));base64,/i)
        if (!mimeMatch) {
            return NextResponse.json({ error: "Định dạng tệp không hợp lệ. Chỉ chấp nhận tệp hình ảnh (PNG, JPG, WEBP, GIF)." }, { status: 400 })
        }

        const sql = getDatabase()
        const existing = await sql<VipPaymentRequest[]>`
            SELECT id, member_id, status FROM public.vip_payment_requests WHERE id = ${requestId} LIMIT 1
        `

        if (existing.length === 0) {
            return NextResponse.json({ error: "Yêu cầu thanh toán không tồn tại." }, { status: 404 })
        }

        if (existing[0].status === "approved") {
            return NextResponse.json({ error: "Yêu cầu thanh toán đã được phê duyệt, không thể thay đổi bằng chứng thanh toán." }, { status: 400 })
        }

        if (existing[0].status === "rejected") {
            return NextResponse.json({ error: "Yêu cầu thanh toán đã bị từ chối." }, { status: 400 })
        }

        const member = await getMemberFromRequest(request)
        const isOwnerSession = Boolean(member && member.id === existing[0].member_id)
        const hasValidUploadToken = Boolean(uploadToken && verifyUploadProofToken(uploadToken, requestId))

        if (!isOwnerSession && !hasValidUploadToken) {
            return NextResponse.json({ error: "Bạn không có quyền cập nhật bằng chứng thanh toán cho yêu cầu này." }, { status: 403 })
        }

        const updated = await sql<Omit<VipPaymentRequest, "proof_image_data">[]>`
            UPDATE public.vip_payment_requests
            SET proof_image_data = ${proofImageData},
                status = 'pending',
                updated_at = now()
            WHERE id = ${requestId}
            RETURNING id, member_id, package_id, package_months, amount, transfer_code, bank_info, status, notes, created_at, approved_at, updated_at
        `

        await recordAuditLog({
            actorType: isOwnerSession ? "member" : "system",
            actorId: isOwnerSession && member ? member.id : existing[0].member_id,
            action: "upload_proof",
            targetType: "vip_payment_request",
            targetId: requestId,
        })

        return NextResponse.json({
            success: true,
            message: "Đã cập nhật bằng chứng thanh toán thành công.",
            request: updated[0],
        })
    } catch (error) {
        console.error("Upload proof error:", error)
        return NextResponse.json({ error: "Không thể cập nhật bằng chứng thanh toán." }, { status: 500 })
    }
}
