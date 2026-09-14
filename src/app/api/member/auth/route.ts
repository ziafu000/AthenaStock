import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import { enqueueEmailJob } from "@/lib/booking/outbox"
import {
    MEMBER_SESSION_COOKIE,
    createMemberSession,
    getMemberFromRequest,
    createOtpToken,
    verifyOtpToken,
} from "@/lib/member/auth"
import { recordAuditLog } from "@/lib/member/audit"
import type { Member } from "@/lib/member/types"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    try {
        const member = await getMemberFromRequest(request)
        if (!member) {
            return NextResponse.json({ authenticated: false, member: null })
        }
        return NextResponse.json({
            authenticated: true,
            member: {
                id: member.id,
                email: member.email,
                full_name: member.full_name,
                phone: member.phone,
                tier: member.tier,
                vip_started_at: member.vip_started_at,
                vip_expires_at: member.vip_expires_at,
                created_at: member.created_at,
            },
        }, { headers: { "Cache-Control": "no-store" } })
    } catch (error) {
        console.error("Failed to get member session:", error)
        return NextResponse.json({ authenticated: false, member: null }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action } = body

        if (action === "logout") {
            const response = NextResponse.json({ success: true })
            response.cookies.set({
                name: MEMBER_SESSION_COOKIE,
                value: "",
                path: "/",
                maxAge: 0,
                httpOnly: true,
                sameSite: "lax",
            })
            return response
        }

        const sql = getDatabase()

        if (action === "request_otp" || (action === "login" && !body.code)) {
            const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
            if (!email || !email.includes("@")) {
                return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 })
            }

            const rows = await sql<Member[]>`
                SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                FROM public.members
                WHERE lower(email) = ${email}
                LIMIT 1
            `

            if (rows.length === 0) {
                return NextResponse.json(
                    { error: "Email chưa được đăng ký. Vui lòng chọn 'Đăng ký' để tạo tài khoản mới." },
                    { status: 404 }
                )
            }

            const code = String(Math.floor(100000 + Math.random() * 900000))
            const otpToken = createOtpToken(email, code)

            try {
                await sql.begin(async (tx) => {
                    await enqueueEmailJob(tx, {
                        kind: "member_otp",
                        recipient: email,
                        idempotencyKey: `otp-${email}-${Date.now()}`,
                        payload: { code },
                    })
                })
            } catch (emailErr) {
                console.warn("Could not enqueue member OTP email:", emailErr)
            }

            return NextResponse.json({
                success: true,
                otpRequired: true,
                message: "Mã xác thực 6 chữ số đã được gửi tới email của bạn.",
                otpToken,
                ...(process.env.NODE_ENV !== "production" ? { devOtp: code } : {}),
            })
        }

        if (action === "verify_otp" || (action === "login" && body.code)) {
            const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
            const code = typeof body.code === "string" ? body.code.trim() : ""
            const otpToken = typeof body.otpToken === "string" ? body.otpToken.trim() : ""

            if (!email || !code || !otpToken) {
                return NextResponse.json({ error: "Vui lòng nhập đầy đủ email và mã xác thực 6 số." }, { status: 400 })
            }

            const isValid = verifyOtpToken(otpToken, email, code)
            if (!isValid) {
                return NextResponse.json({ error: "Mã xác thực không đúng hoặc đã hết hạn (10 phút)." }, { status: 400 })
            }

            const rows = await sql<Member[]>`
                SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                FROM public.members
                WHERE lower(email) = ${email}
                LIMIT 1
            `

            if (rows.length === 0) {
                return NextResponse.json({ error: "Tài khoản không tồn tại." }, { status: 404 })
            }

            let member = rows[0]
            if (member.tier === "vip" && member.vip_expires_at && new Date(member.vip_expires_at).getTime() <= Date.now()) {
                const updated = await sql<Member[]>`
                    UPDATE public.members
                    SET tier = 'normal', updated_at = now()
                    WHERE id = ${member.id}
                    RETURNING id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
                `
                if (updated.length > 0) member = updated[0]
            }

            const token = createMemberSession(member)

            await recordAuditLog({
                actorType: "member",
                actorId: member.id,
                action: "login",
                targetType: "member",
                targetId: member.id,
            })

            const response = NextResponse.json({
                success: true,
                member: {
                    id: member.id,
                    email: member.email,
                    full_name: member.full_name,
                    phone: member.phone,
                    tier: member.tier,
                    vip_started_at: member.vip_started_at,
                    vip_expires_at: member.vip_expires_at,
                },
            })

            response.cookies.set({
                name: MEMBER_SESSION_COOKIE,
                value: token,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60,
            })

            return response
        }

        if (action === "register") {
            const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
            const fullName = typeof body.full_name === "string" ? body.full_name.trim() : ""
            const phone = typeof body.phone === "string" ? body.phone.trim() : null

            if (!email || !email.includes("@")) {
                return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 })
            }
            if (!fullName || fullName.length < 2) {
                return NextResponse.json({ error: "Họ và tên không được để trống (tối thiểu 2 ký tự)." }, { status: 400 })
            }

            const existing = await sql<Member[]>`
                SELECT id FROM public.members WHERE lower(email) = ${email} LIMIT 1
            `

            if (existing.length > 0) {
                return NextResponse.json(
                    { error: "Email này đã được đăng ký tài khoản. Vui lòng chuyển sang tab Đăng nhập để nhận mã xác thực." },
                    { status: 409 }
                )
            }

            const inserted = await sql<Member[]>`
                INSERT INTO public.members (
                    email, full_name, phone, tier
                ) VALUES (
                    ${email}, ${fullName}, ${phone}, 'normal'
                )
                RETURNING id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
            `
            const member = inserted[0]

            await recordAuditLog({
                actorType: "member",
                actorId: member.id,
                action: "register",
                targetType: "member",
                targetId: member.id,
            })

            const token = createMemberSession(member)
            const response = NextResponse.json({
                success: true,
                member: {
                    id: member.id,
                    email: member.email,
                    full_name: member.full_name,
                    phone: member.phone,
                    tier: member.tier,
                    vip_started_at: member.vip_started_at,
                    vip_expires_at: member.vip_expires_at,
                },
            })

            response.cookies.set({
                name: MEMBER_SESSION_COOKIE,
                value: token,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60,
            })

            return response
        }

        return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 })
    } catch (error) {
        console.error("Member auth error:", error)
        return NextResponse.json({ error: "Đã có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 })
    }
}
