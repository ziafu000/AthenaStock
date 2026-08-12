"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react"

interface Suggestion {
    date: string
    timeBlock: string
}

interface ResponseDetails {
    name: string
    current: Suggestion
    suggestions: Suggestion[]
    unavailableByDate: Record<string, string[]>
}

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

function RespondContent() {
    const token = useSearchParams().get("token") || ""
    const [details, setDetails] = useState<ResponseDetails | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [state, setState] = useState<"loading" | "ready" | "submitting" | "success" | "error">("loading")
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false
        async function load() {
            if (!token) {
                setError("Liên kết đổi lịch không hợp lệ.")
                setState("error")
                return
            }
            try {
                const response = await fetch(`/api/booking/respond?token=${encodeURIComponent(token)}`, { cache: "no-store" })
                const data = await response.json()
                if (!response.ok) throw new Error(data.error || "Không thể tải đề xuất đổi lịch.")
                if (cancelled) return
                const next = data as ResponseDetails
                setDetails(next)
                const firstAvailable = next.suggestions.findIndex((item) => !next.unavailableByDate[item.date]?.includes(item.timeBlock))
                setSelectedIndex(firstAvailable >= 0 ? firstAvailable : null)
                setState("ready")
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Không thể tải đề xuất đổi lịch.")
                    setState("error")
                }
            }
        }
        void load()
        return () => { cancelled = true }
    }, [token])

    const selected = useMemo(
        () => selectedIndex === null ? null : details?.suggestions[selectedIndex] || null,
        [details, selectedIndex],
    )

    async function submit() {
        if (!selected) return
        setState("submitting")
        setError("")
        try {
            const response = await fetch("/api/booking/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, date: selected.date, timeBlock: selected.timeBlock }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể xác nhận lịch mới.")
            setState("success")
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Không thể xác nhận lịch mới.")
            setState("ready")
        }
    }

    if (state === "loading") {
        return <div className="min-h-screen bg-[#090d16] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>
    }

    return (
        <main className="min-h-screen bg-[#090d16] px-4 py-10 text-white">
            <div className="mx-auto w-full max-w-xl">
                <Image src="/logo.png" alt="Athena Stock" width={90} height={90} className="mx-auto mb-6 h-16 w-auto" />
                <section className="rounded-3xl border border-white/[0.08] bg-[#090d16]/90 p-6 shadow-2xl md:p-8">
                    {state === "success" ? (
                        <div className="space-y-5 text-center">
                            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
                            <h1 className="font-serif text-3xl font-bold">Đã xác nhận lịch mới</h1>
                            <p className="text-sm text-[#a0a5b5]">Thông tin cuộc hẹn và file lịch mới sẽ được gửi qua email.</p>
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
                                <h1 className="font-serif text-3xl font-bold">Chọn lịch hẹn mới</h1>
                                <p className="mt-2 text-sm text-[#a0a5b5]">Chào {details.name}, vui lòng chọn một khung giờ còn trống bên dưới.</p>
                            </div>

                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-[#a0a5b5]">
                                Lịch hiện tại: <span className="text-white">{formatDate(details.current.date)} · {details.current.timeBlock}</span>
                            </div>

                            <div className="space-y-3">
                                {details.suggestions.map((suggestion, index) => {
                                    const unavailable = details.unavailableByDate[suggestion.date]?.includes(suggestion.timeBlock)
                                    return (
                                        <button
                                            key={`${suggestion.date}-${suggestion.timeBlock}-${index}`}
                                            type="button"
                                            disabled={unavailable}
                                            onClick={() => setSelectedIndex(index)}
                                            className={`w-full rounded-2xl border p-4 text-left transition ${selectedIndex === index ? "border-[#e61c5c] bg-[#e61c5c]/10" : "border-white/[0.08] bg-white/[0.02]"} disabled:cursor-not-allowed disabled:opacity-40`}
                                        >
                                            <span className="flex items-center gap-2 text-sm font-semibold"><Calendar size={16} /> {formatDate(suggestion.date)}</span>
                                            <span className="mt-2 flex items-center gap-2 text-xs text-[#a0a5b5]"><Clock size={14} /> {suggestion.timeBlock}{unavailable ? " · Đã có người đặt" : ""}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}
                            {!selected && <p className="text-sm text-amber-400">Các đề xuất hiện đã hết chỗ. Vui lòng liên hệ Athena Stock để được hỗ trợ.</p>}

                            <button
                                type="button"
                                disabled={!selected || state === "submitting"}
                                onClick={submit}
                                className="h-12 w-full rounded-full bg-[#9c1850] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {state === "submitting" ? "Đang xác nhận..." : "Xác nhận lịch đã chọn"}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default function BookingRespondPage() {
    return <Suspense><RespondContent /></Suspense>
}
