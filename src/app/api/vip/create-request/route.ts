import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "node:crypto"
import { getDatabase } from "@/lib/booking/db"
import { getMemberFromRequest, createUploadProofToken } from "@/lib/member/auth"
import { VIP_PACKAGES, BANK_CONFIG } from "@/lib/member/types"
import type { Member, VipPaymentRequest } from "@/lib/member/types"
import { recordAuditLog } from "@/lib/member/audit"

export const runtime = "nodejs"

function generateTransferCode(months: number): string {
    const monthPad = String(months).padStart(2, "0")
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    const bytes = randomBytes(4)
    let code = ""
    for (let i = 0; i < 4; i++) {
        code += chars[bytes[i] % chars.length]
    }
    return `ATHENA DK V${monthPad} ${code}`
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { package_id, email, full_name, phone } = body

        const pkg = VIP_PACKAGES.find((p) => p.id === package_id)
        if (!pkg) {
            return NextResponse.json({ error: "Gói VIP không hợp lệ." }, { status: 400 })
        }

        const sql = getDatabase()
        let member: Member | null = await getMemberFromRequest(request)

        if (!member) {
            const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
            const cleanName = typeof full_name === "string" ? full_name.trim() : ""
            const cleanPhone = typeof phone === "string" ? phone.trim() : null

            if (!cleanEmail || !cleanEmail.includes("@")) {
                return NextResponse.json({ error: "Vui lòng nhập địa chỉ email hợp lệ." }, { status: 400 })
            }
            if (!cleanName || cleanName.length < 2) {
                return NextResponse.json({ error: "Vui lòng nhập họ và tên (tối thiểu 2 ký tự)." }, { status: 400 })
            }

            const existing = await sql<Member[]>`
                SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                FROM public.members
                WHERE lower(email) = ${cleanEmail}
                LIMIT 1
            `

            if (existing.length > 0) {
                member = existing[0]
            } else {
                const inserted = await sql<Member[]>`
                    INSERT INTO public.members (
                        email, full_name, phone, tier
                    ) VALUES (
                        ${cleanEmail}, ${cleanName}, ${cleanPhone}, 'normal'
                    )
                    RETURNING id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                `
                member = inserted[0]
            }
        }

        if (!member) {
            return NextResponse.json({ error: "Không thể xác định thông tin thành viên." }, { status: 400 })
        }

        let transferCode = generateTransferCode(pkg.months)
        for (let attempt = 0; attempt < 5; attempt++) {
            const duplicateCheck = await sql`
                SELECT id FROM public.vip_payment_requests WHERE transfer_code = ${transferCode} LIMIT 1
            `
            if (duplicateCheck.length === 0) break
            transferCode = generateTransferCode(pkg.months)
        }

        const bankInfo = {
            bankName: BANK_CONFIG.bankName,
            bankId: BANK_CONFIG.bankId,
            accountNumber: BANK_CONFIG.accountNumber,
            accountName: BANK_CONFIG.accountName,
        }

        const inserted = await sql<VipPaymentRequest[]>`
            INSERT INTO public.vip_payment_requests (
                member_id, package_id, package_months, amount, transfer_code, bank_info, status
            ) VALUES (
                ${member.id}, ${pkg.id}, ${pkg.months}, ${pkg.amount}, ${transferCode}, ${JSON.stringify(bankInfo)}, 'pending'
            )
            RETURNING id, member_id, package_id, package_months, amount, transfer_code, bank_info, status, proof_image_data, notes, created_at, approved_at, updated_at
        `

        const newRequest = inserted[0]
        const uploadToken = createUploadProofToken(newRequest.id, member.id)

        await recordAuditLog({
            actorType: "member",
            actorId: member.id,
            action: "create_vip_payment_request",
            targetType: "vip_payment_request",
            targetId: newRequest.id,
            details: {
                package_id: pkg.id,
                amount: pkg.amount,
                transfer_code: transferCode,
            },
        })

        const qrCodeUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${pkg.amount}&addInfo=${encodeURIComponent(transferCode)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`

        return NextResponse.json({
            success: true,
            request: {
                ...newRequest,
                qr_code_url: qrCodeUrl,
                upload_token: uploadToken,
            },
            member: {
                id: member.id,
                email: member.email,
                full_name: member.full_name,
                tier: member.tier,
            },
        })
    } catch (error) {
        console.error("Create VIP request error:", error)
        return NextResponse.json({ error: "Không thể tạo yêu cầu thanh toán." }, { status: 500 })
    }
}
