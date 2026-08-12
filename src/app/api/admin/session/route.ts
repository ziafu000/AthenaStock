import { NextRequest, NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, isAdminRequest } from "@/lib/booking/admin-auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    return NextResponse.json({ authenticated: isAdminRequest(request) }, { headers: { "Cache-Control": "no-store" } })
}

export async function DELETE() {
    const response = NextResponse.json({ success: true })
    response.cookies.set({ name: ADMIN_SESSION_COOKIE, value: "", path: "/", maxAge: 0 })
    return response
}
