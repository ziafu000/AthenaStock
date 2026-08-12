import { NextRequest, NextResponse } from "next/server"
import { processEmailQueue } from "@/lib/booking/email-worker"

export const runtime = "nodejs"
export const maxDuration = 60

function authorized(request: NextRequest) {
    const secret = process.env.CRON_SECRET
    if (!secret) return process.env.NODE_ENV !== "production"
    return request.headers.get("authorization") === `Bearer ${secret}`
}

async function handle(request: NextRequest) {
    if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    try {
        return NextResponse.json(await processEmailQueue(25))
    } catch (error) {
        console.error("Booking email worker failed:", error)
        return NextResponse.json({ error: "Email worker failed." }, { status: 503 })
    }
}

export const GET = handle
export const POST = handle
