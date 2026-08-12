"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus, Trash2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { minimumBookingDate, TIME_BLOCKS } from "@/lib/booking/policy"

interface Suggestion {
    id: string
    date: string
    timeBlock: string
}

interface BookingDetails {
    name: string
    email: string
    date: string
    timeBlock: string
}

function addDaysToDateOnly(date: string, days: number) {
    const [year, month, day] = date.split("-").map(Number)
    const result = new Date(Date.UTC(year, month - 1, day + days))
    return result.toISOString().slice(0, 10)
}

function createInitialSuggestions(date: string, timeBlock: string): Suggestion[] {
    return [1, 2].map((daysToAdd, index) => {
        return {
            id: `s${index + 1}`,
            date: addDaysToDateOnly(date, daysToAdd),
            timeBlock: timeBlock || "09:00 - 10:00 (Sáng)",
        }
    })
}

function RescheduleContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || ""

    const [accessStatus, setAccessStatus] = useState<"loading" | "valid" | "invalid">("loading")
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])

    const name = bookingDetails?.name || "Khách hàng"
    const email = bookingDetails?.email || ""
    const originalDate = bookingDetails?.date || ""
    const originalTimeBlock = bookingDetails?.timeBlock || ""

    useEffect(() => {
        let cancelled = false

        async function loadBooking() {
            if (!token) {
                setAccessStatus("invalid")
                return
            }

            try {
                const response = await fetch(`/api/booking/reschedule?token=${encodeURIComponent(token)}`, {
                    cache: "no-store",
                })
                if (!response.ok) throw new Error("Invalid booking access")
                const details = await response.json() as BookingDetails
                if (cancelled) return

                setBookingDetails(details)
                setSuggestions(createInitialSuggestions(details.date, details.timeBlock))
                setAccessStatus("valid")
            } catch {
                if (!cancelled) setAccessStatus("invalid")
            }
        }

        void loadBooking()
        return () => {
            cancelled = true
        }
    }, [token])

    const handleAddSuggestion = () => {
        const lastDate = suggestions.length > 0 
            ? suggestions[suggestions.length - 1].date 
            : new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())

        setSuggestions([
            ...suggestions,
            {
                id: `s-${Date.now()}`,
                date: addDaysToDateOnly(lastDate, 1),
                timeBlock: originalTimeBlock || "09:00 - 10:00 (Sáng)",
            }
        ])
    }

    const handleRemoveSuggestion = (idToRemove: string) => {
        setSuggestions(suggestions.filter(s => s.id !== idToRemove))
    }

    const handleUpdateSuggestion = (idToUpdate: string, field: "date" | "timeBlock", value: string) => {
        setSuggestions(
            suggestions.map(s => {
                if (s.id === idToUpdate) {
                    return { ...s, [field]: value }
                }
                return s
            })
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (suggestions.length === 0) {
            setStatus("error")
            setErrorMessage("Vui lòng thêm ít nhất một khung giờ đề xuất thay thế.")
            return
        }

        setStatus("submitting")

        try {
            const res = await fetch("/api/booking/reschedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    suggestions: suggestions.map(s => ({ date: s.date, timeBlock: s.timeBlock })),
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
            } else {
                setStatus("error")
                setErrorMessage(data.error || "Có lỗi xảy ra khi gửi đề xuất đổi lịch.")
            }
        } catch {
            setStatus("error")
            setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
        }
    }

    if (accessStatus === "loading") {
        return (
            <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white font-sans">
                <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </div>
        )
    }

    if (accessStatus === "invalid") {
        return (
            <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-white font-sans">
                <div className="w-full max-w-md p-8 rounded-3xl border border-red-500/20 bg-red-950/[0.04] text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-serif font-bold text-red-500">Xác thực thất bại</h2>
                    <p className="text-sm text-[#a0a5b5] leading-relaxed">
                        Mã token xác nhận không chính xác hoặc đã hết hạn. Bạn không có quyền truy cập trang này.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 md:p-8 text-white font-sans relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#e61c5c]/3 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10 my-8">
                {/* Header Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/logo.png"
                        alt="Athena Stock"
                        width={90}
                        height={90}
                        className="h-16 w-auto drop-shadow-2xl"
                    />
                </div>

                {status === "success" ? (
                    <div className="rounded-3xl border border-white/[0.08] bg-[#090d16]/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif font-bold">Gửi đề xuất thành công!</h2>
                        
                        <div className="text-left bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-3 max-w-lg mx-auto text-sm text-[#a0a5b5]">
                            <p>✓ Đề xuất đổi lịch cho <strong className="text-white">{name}</strong> đã được lưu.</p>
                            <p>✓ Khách hàng sẽ nhận email tại <strong className="text-white">{email}</strong> để trực tiếp chọn và xác nhận lịch mới.</p>
                            <div className="pt-2 border-t border-white/[0.06] mt-2">
                                <p className="font-semibold text-white mb-1">Các khung giờ bạn đã đề xuất:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {suggestions.map((s, idx) => (
                                        <li key={s.id}>
                                            Đề xuất {idx + 1}: <span className="text-[#e61c5c] font-semibold">{s.timeBlock}</span> ngày {new Date(s.date).toLocaleDateString("vi-VN")}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center gap-4">
                            <Link
                                href="/"
                                className="h-11 px-6 rounded-full border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm flex items-center justify-center"
                            >
                                Về trang chủ
                            </Link>
                            <button
                                onClick={() => window.close()}
                                className="h-11 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold active:scale-[0.98] transition-all text-sm"
                            >
                                Đóng trang
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-white/[0.08] bg-[#090d16]/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                                Đề xuất <span className="text-[#e61c5c] italic font-medium">Thay đổi Lịch hẹn</span>
                            </h2>
                            <p className="text-xs text-[#a0a5b5] leading-relaxed">
                                Khung giờ yêu cầu ban đầu của khách hàng bị trùng lịch bận. Vui lòng chọn các khung giờ thay thế khác mà bạn sẵn sàng trao đổi để gửi phản hồi HTML cho khách.
                            </p>
                        </div>

                        {/* Original Booking Details Card */}
                        <div className="border border-white/[0.06] bg-white/[0.01] rounded-2xl p-5 space-y-3 text-sm">
                            <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Thông tin yêu cầu ban đầu</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[#a0a5b5] block text-xs">Khách hàng:</span>
                                    <strong className="text-white">{name}</strong>
                                </div>
                                <div>
                                    <span className="text-[#a0a5b5] block text-xs">Địa chỉ Email:</span>
                                    <strong className="text-white break-all">{email}</strong>
                                </div>
                                <div>
                                    <span className="text-[#a0a5b5] block text-xs">Ngày yêu cầu:</span>
                                    <strong className="text-white">
                                        {originalDate ? new Date(originalDate).toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-[#a0a5b5] block text-xs">Khung giờ:</span>
                                    <strong className="text-red-400 line-through">{originalTimeBlock}</strong>
                                </div>
                            </div>
                        </div>

                        {status === "error" && (
                            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                                        Danh sách giờ đề xuất mới
                                    </h4>
                                    {suggestions.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={handleAddSuggestion}
                                            className="text-xs text-[#e61c5c] font-semibold flex items-center gap-1 hover:underline hover:text-[#d11550] transition-colors"
                                        >
                                            <Plus size={14} /> Thêm giờ đề xuất
                                        </button>
                                    )}
                                </div>

                                {suggestions.length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl text-sm text-[#a0a5b5] space-y-2">
                                        <p>Chưa có khung giờ đề xuất nào.</p>
                                        <button
                                            type="button"
                                            onClick={handleAddSuggestion}
                                            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                                        >
                                            + Tạo đề xuất đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                                        {suggestions.map((s, idx) => (
                                            <div key={s.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3 md:p-4">
                                                <span className="text-xs text-muted-foreground font-bold shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                
                                                <div className="grid grid-cols-2 gap-3 flex-1">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Calendar size={10} /> Ngày đề xuất</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            min={minimumBookingDate()}
                                                            value={s.date}
                                                            onChange={(e) => handleUpdateSuggestion(s.id, "date", e.target.value)}
                                                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-xs text-white focus:border-[#e61c5c]/50 focus:outline-none transition-all dark:scheme-dark"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Clock size={10} /> Khung giờ</label>
                                                        <select
                                                            value={s.timeBlock}
                                                            onChange={(e) => handleUpdateSuggestion(s.id, "timeBlock", e.target.value)}
                                                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-xs text-white focus:border-[#e61c5c]/50 focus:outline-none transition-all select-dark"
                                                        >
                                                            {Object.keys(TIME_BLOCKS).map((timeBlock) => (
                                                                <option className="text-black" key={timeBlock} value={timeBlock}>{timeBlock}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSuggestion(s.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-400 hover:bg-white/5 rounded-xl transition-all self-end mb-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    Đang đề xuất <strong className="text-white">{suggestions.length}</strong> lựa chọn <ArrowRight size={12} /> gửi tới khách
                                </span>
                                <button
                                    type="submit"
                                    disabled={status === "submitting" || suggestions.length === 0}
                                    className="h-12 px-8 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                                >
                                    {status === "submitting" ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Đang xử lý gửi mail...
                                        </span>
                                    ) : (
                                        "Gửi đề xuất đổi lịch"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

function ReschedulePageWrapper() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || ""

    return (
        <RescheduleContent key={token} />
    )
}

export default function ReschedulePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white font-sans">
                <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </div>
        }>
            <ReschedulePageWrapper />
        </Suspense>
    )
}
