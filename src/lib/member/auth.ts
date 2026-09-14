import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import type { Member } from "./types"

export const MEMBER_SESSION_COOKIE = "athena_member_session"

interface MemberSessionPayload {
    version: 1
    memberId: string
    email: string
    tier: string
    expiresAt: number
}

function secret() {
    return process.env.ADMIN_SESSION_SECRET || process.env.BOOKING_SECRET || "athena-stock-member-secret-2025"
}

function signature(payload: string) {
    return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function createMemberSession(member: { id: string; email: string; tier: string }) {
    const payload: MemberSessionPayload = {
        version: 1,
        memberId: member.id,
        email: member.email.toLowerCase(),
        tier: member.tier,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    }
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
    return `${encoded}.${signature(encoded)}`
}

export function verifyMemberSessionToken(token: string | undefined): MemberSessionPayload | null {
    if (!token) return null
    const [encoded, supplied, extra] = token.split(".")
    if (!encoded || !supplied || extra) return null

    const expected = signature(encoded)
    const expectedBuffer = Buffer.from(expected)
    const suppliedBuffer = Buffer.from(supplied)
    if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) {
        return null
    }

    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as MemberSessionPayload
        if (payload.version !== 1 || payload.expiresAt <= Date.now()) {
            return null
        }
        return payload
    } catch {
        return null
    }
}

export async function getMemberFromRequest(request: NextRequest): Promise<Member | null> {
    const cookie = request.cookies.get(MEMBER_SESSION_COOKIE)?.value
    const payload = verifyMemberSessionToken(cookie)
    if (!payload) return null

    const sql = getDatabase()
    const rows = await sql<Member[]>`
        SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
        FROM public.members
        WHERE id = ${payload.memberId}
        LIMIT 1
    `

    if (rows.length === 0) return null
    return rows[0]
}

export function isVipMember(member: Member | null): boolean {
    if (!member) return false
    if (member.tier !== "vip") return false
    if (!member.vip_expires_at) return true
    return new Date(member.vip_expires_at).getTime() > Date.now()
}
