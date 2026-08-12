"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface CancellationDetails {
    name: string
    date: string
    timeBlock: string
    status: string
}

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

function CancelContent() {
    const token = useSearchParams().get("token") || ""
    const [details, setDetails] = useState<CancellationDetails | null>(null)
    const [reason, setReason] = useState("")
    const [state, setState] = useState<"loading" | "ready" | "submitting" | "success" | "error">("loading")
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false
        async function load() {
            if (!token) {
                setError("Liên kết hủy lịch không hợp lệ.")
                setState("error")
                return
            }
            try {
                const response = await fetch(`/api/booking/cancel?token=${encodeURIComponent(token)}`, { cache: "no-store" })
                const data = await response.json()
                if (!response.ok) throw new Error(data.error || "Không thể tải lịch hẹn.")
                if (!cancelled) {
                    setDetails(data as CancellationDetails)
                    setState("ready")
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Không thể tải lịch hẹn.")
                    setState("error")
                }
            }
        }
        void load()
        return () => { cancelled = true }
    }, [token])

    async function submit() {
        if (!window.confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return
        setState("submitting")
        setError("")
        try {
            const response = await fetch("/api/booking/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, reason }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể hủy lịch hẹn.")
            setState("success")
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Không thể hủy lịch hẹn.")
            setState("ready")
        }
    }

    if (state === "loading") {
        return <div className="min-h-screen bg-[#090d16] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>
    }

    return (
        <main className="min-h-screen bg-[#090d16] px-4 py-10 text-white">
            <div className="mx-auto w-full max-w-lg">
                <Image src="/logo.png" alt="Athena Stock" width={90} height={90} className="mx-auto mb-6 h-16 w-auto" />
                <section className="rounded-3xl border border-white/[0.08] p-6 shadow-2xl md:p-8">
                    {state === "success" ? (
                        <div className="space-y-5 text-center">
                            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
                            <h1 className="font-serif text-3xl font-bold">Đã hủy lịch hẹn</h1>
                            <p className="text-sm text-[#a0a5b5]">Athena Stock đã được thông báo qua email.</p>
                            <Link href="/" className="inline-flex h-11 items-center rounded-full bg-[#9c1850] px-7 text-sm font-semibold">Về trang chủ</Link>
                        </div>
                    ) : state === "error" || !details ? (
                        <div className="space-y-4 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                            <h1 className="font-serif text-2xl font-bold">Không thể mở liên kết</h1>
                            <p className="text-sm text-[#a0a5b5]">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h1 className="font-serif text-3xl font-bold">Hủy lịch hẹn</h1>
                                <p className="mt-2 text-sm text-[#a0a5b5]">Chào {details.name}, thao tác này không thể hoàn tác bằng cùng liên kết.</p>
                            </div>
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm">
                                <p>{formatDate(details.date)}</p>
                                <p className="mt-1 text-[#a0a5b5]">{details.timeBlock}</p>
                            </div>
                            <label className="block space-y-2 text-xs font-semibold uppercase tracking-wider text-[#a0a5b5]">
                                Lý do (không bắt buộc)
                                <textarea
                                    value={reason}
                                    maxLength={500}
                                    onChange={(event) => setReason(event.target.value)}
                                    className="min-h-28 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#e61c5c]/60"
                                />
                            </label>
                            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}
                            <button
                                type="button"
                                disabled={state === "submitting"}
                                onClick={submit}
                                className="h-12 w-full rounded-full bg-red-700 font-semibold disabled:opacity-50"
                            >
                                {state === "submitting" ? "Đang hủy..." : "Xác nhận hủy lịch"}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default function BookingCancelPage() {
    return <Suspense><CancelContent /></Suspense>
}
