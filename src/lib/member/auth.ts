import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/booking/db"
import type { Member } from "./types"

export const MEMBER_SESSION_COOKIE = "athena_member_session"

export interface MemberSessionPayload {
    version: 1
    memberId: string
    email: string
    tier: string
    vipExpiresAt: string | null
    expiresAt: number
}

function secret() {
    const value = process.env.ADMIN_SESSION_SECRET || process.env.BOOKING_SECRET
    if (!value) {
        throw new Error("Thiếu biến môi trường ADMIN_SESSION_SECRET hoặc BOOKING_SECRET.")
    }
    return value
}

function signature(payload: string) {
    return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function createMemberSession(member: {
    id: string
    email: string
    tier: string
    vip_expires_at?: string | null
}) {
    const isVipExpired = Boolean(
        member.tier === "vip"
        && member.vip_expires_at
        && new Date(member.vip_expires_at).getTime() <= Date.now()
    )
    const effectiveTier = isVipExpired ? "normal" : member.tier

    const payload: MemberSessionPayload = {
        version: 1,
        memberId: member.id,
        email: member.email.toLowerCase(),
        tier: effectiveTier,
        vipExpiresAt: member.vip_expires_at || null,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
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

export async function getMemberFromCookie(cookieValue: string | undefined): Promise<Member | null> {
    const payload = verifyMemberSessionToken(cookieValue)
    if (!payload) return null

    const sql = getDatabase()
    const rows = await sql<Member[]>`
        SELECT id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
        FROM public.members
        WHERE id = ${payload.memberId}
        LIMIT 1
    `

    if (rows.length === 0) return null
    const member = rows[0]

    if (member.tier === "vip" && member.vip_expires_at && new Date(member.vip_expires_at).getTime() <= Date.now()) {
        const updated = await sql<Member[]>`
            UPDATE public.members
            SET tier = 'normal', updated_at = now()
            WHERE id = ${member.id}
            RETURNING id, email, full_name, phone, tier, vip_started_at, vip_expires_at, created_at, updated_at
        `
        if (updated.length > 0) return updated[0]
        member.tier = "normal"
    }

    return member
}

export async function getMemberFromRequest(request: NextRequest): Promise<Member | null> {
    return getMemberFromCookie(request.cookies.get(MEMBER_SESSION_COOKIE)?.value)
}

export function isVipMember(member: Member | null): boolean {
    if (!member) return false
    if (member.tier !== "vip") return false
    if (!member.vip_expires_at) return true
    return new Date(member.vip_expires_at).getTime() > Date.now()
}

export function isSessionVip(session: MemberSessionPayload | null): boolean {
    if (!session) return false
    if (session.tier !== "vip") return false
    if (session.vipExpiresAt) {
        return new Date(session.vipExpiresAt).getTime() > Date.now()
    }
    return true
}

export function createOtpToken(email: string, code: string, ttlMs = 10 * 60 * 1000): string {
    const expiresAt = Date.now() + ttlMs
    const cleanEmail = email.trim().toLowerCase()
    const data = `${cleanEmail}:${code.trim()}:${expiresAt}`
    const sig = createHmac("sha256", secret()).update(data).digest("base64url")
    return `${Buffer.from(JSON.stringify({ email: cleanEmail, expiresAt })).toString("base64url")}.${sig}`
}

export function verifyOtpToken(token: string | undefined, email: string, code: string): boolean {
    if (!token) return false
    const [encoded, sig, extra] = token.split(".")
    if (!encoded || !sig || extra) return false

    try {
        const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { email: string; expiresAt: number }
        if (!parsed || parsed.expiresAt <= Date.now()) return false
        if (parsed.email !== email.trim().toLowerCase()) return false

        const expectedSig = createHmac("sha256", secret()).update(`${parsed.email}:${code.trim()}:${parsed.expiresAt}`).digest("base64url")
        const expectedBuf = Buffer.from(expectedSig)
        const suppliedBuf = Buffer.from(sig)
        if (expectedBuf.length !== suppliedBuf.length || !timingSafeEqual(expectedBuf, suppliedBuf)) {
            return false
        }
        return true
    } catch {
        return false
    }
}

export function createUploadProofToken(requestId: string, memberId: string, ttlMs = 2 * 60 * 60 * 1000): string {
    const expiresAt = Date.now() + ttlMs
    const data = `${requestId}:${memberId}:${expiresAt}`
    const sig = createHmac("sha256", secret()).update(data).digest("base64url")
    return `${Buffer.from(JSON.stringify({ requestId, memberId, expiresAt })).toString("base64url")}.${sig}`
}

export function verifyUploadProofToken(token: string | undefined, requestId: string): boolean {
    if (!token) return false
    const [encoded, sig, extra] = token.split(".")
    if (!encoded || !sig || extra) return false

    try {
        const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { requestId: string; memberId: string; expiresAt: number }
        if (!parsed || parsed.expiresAt <= Date.now()) return false
        if (parsed.requestId !== requestId) return false

        const expectedSig = createHmac("sha256", secret()).update(`${requestId}:${parsed.memberId}:${parsed.expiresAt}`).digest("base64url")
        const expectedBuf = Buffer.from(expectedSig)
        const suppliedBuf = Buffer.from(sig)
        if (expectedBuf.length !== suppliedBuf.length || !timingSafeEqual(expectedBuf, suppliedBuf)) {
            return false
        }
        return true
    } catch {
        return false
    }
}
