import { NextRequest, NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, consumeAdminLogin } from "@/lib/booking/admin-auth"
import { InvalidActionTokenError } from "@/lib/booking/actions"
import { getAdminEmail } from "@/lib/booking/email"
import { escapeHtml } from "@/lib/booking/html"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token") || ""
    const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Xác nhận đăng nhập quản trị</title></head>
<body style="font-family:system-ui;max-width:560px;margin:64px auto;padding:0 20px;color:#161616">
<h1>Xác nhận đăng nhập</h1><p>Nhấn nút bên dưới để đăng nhập trang quản trị booking.</p>
<form method="post" action="/api/admin/auth/verify">
<input type="hidden" name="token" value="${escapeHtml(token)}">
<button type="submit" style="padding:12px 18px;cursor:pointer">Đăng nhập</button>
</form></body></html>`
    return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    })
}

export async function POST(request: NextRequest) {
    const destination = new URL("/admin/bookings", request.url)
    try {
        const form = await request.formData()
        const token = typeof form.get("token") === "string" ? String(form.get("token")) : ""
        const adminEmail = getAdminEmail()
        const session = await consumeAdminLogin(token, adminEmail)
        const response = NextResponse.redirect(destination, 303)
        response.cookies.set({
            name: ADMIN_SESSION_COOKIE,
            value: session,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 12 * 60 * 60,
        })
        return response
    } catch (error) {
        console.error("Admin login verification failed:", error)
        destination.searchParams.set("login", error instanceof InvalidActionTokenError ? "invalid" : "error")
        return NextResponse.redirect(destination, 303)
    }
}
