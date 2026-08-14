"use client"

import { Suspense, useCallback, useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { TurnstileWidget } from "@/components/booking/TurnstileWidget"
import { TIME_BLOCKS } from "@/lib/booking/policy"

const timeBlocks = Object.keys(TIME_BLOCKS)
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const vietnamDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

function addDaysToDateOnly(date: string, days: number) {
    const [year, month, day] = date.split("-").map(Number)
    const result = new Date(Date.UTC(year, month - 1, day + days))
    return result.toISOString().slice(0, 10)
}

function BookingModalContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const isOpen = searchParams.get("booking") === "open"

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [date, setDate] = useState("")
    const [timeBlock, setTimeBlock] = useState(timeBlocks[0])
    const [unavailable, setUnavailable] = useState<string[]>([])
    const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "loading" | "error">("idle")
    const [captchaToken, setCaptchaToken] = useState("")
    const [captchaResetKey, setCaptchaResetKey] = useState(0)
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [minDate] = useState(() => addDaysToDateOnly(vietnamDateFormatter.format(new Date()), 1))
    const handleCaptchaToken = useCallback((token: string) => setCaptchaToken(token), [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    useEffect(() => {
        if (!date) return

        const controller = new AbortController()
        fetch(`/api/booking/availability?date=${encodeURIComponent(date)}`, {
            cache: "no-store",
            signal: controller.signal,
        })
            .then(async (response) => {
                const data = await response.json() as { unavailable?: string[]; error?: string }
                if (!response.ok) throw new Error(data.error || "Không thể tải lịch trống.")
                const blocked = data.unavailable || []
                setUnavailable(blocked)
                setTimeBlock((current) => blocked.includes(current)
                    ? timeBlocks.find((item) => !blocked.includes(item)) || current
                    : current)
                setAvailabilityStatus("idle")
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
                setUnavailable([])
                setAvailabilityStatus("error")
            })

        return () => controller.abort()
    }, [date])

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("booking")
        const query = params.toString() ? `?${params.toString()}` : ""
        router.push(`${pathname}${query}`)
        // Reset states
        setName("")
        setEmail("")
        setPhone("")
        setDate("")
        setTimeBlock(timeBlocks[0])
        setUnavailable([])
        setAvailabilityStatus("idle")
        setCaptchaToken("")
        setCaptchaResetKey((value) => value + 1)
        setMessage("")
        setStatus("idle")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")

        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    date,
                    timeBlock,
                    message,
                    captchaToken,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
            } else {
                setStatus("error")
                setErrorMessage(data.error || "Có lỗi xảy ra khi đặt lịch.")
                setCaptchaToken("")
                setCaptchaResetKey((value) => value + 1)
            }
        } catch {
            setStatus("error")
            setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
            setCaptchaToken("")
            setCaptchaResetKey((value) => value + 1)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090d16]/80 backdrop-blur-md overflow-y-auto">
            <div 
                className="relative w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#090d16]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-all"
                >
                    <X size={20} />
                </button>

                {status === "success" ? (
                    <div className="text-center py-6 space-y-4">
                        <div className="flex justify-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">Yêu cầu đã được nhận!</h3>
                        <p className="text-sm text-[#a0a5b5] leading-relaxed max-w-md mx-auto font-sans">
                            Chào <strong className="text-white">{name}</strong>, yêu cầu của bạn đã được gửi tới quản trị viên và chưa phải là lịch hẹn đã xác nhận.
                        </p>
                        <p className="text-xs text-[#e61c5c] font-semibold bg-[#e61c5c]/5 border border-[#e61c5c]/10 py-2.5 px-4 rounded-xl inline-block max-w-xs font-sans">
                            Quản trị viên sẽ xem xét và gửi email xác nhận hoặc đề xuất khung giờ khác trong vòng 24 giờ.
                        </p>
                        <div className="pt-6">
                            <button
                                onClick={handleClose}
                                className="h-11 px-8 rounded-full bg-white text-black font-semibold hover:bg-white/90 active:scale-[0.98] transition-all text-sm font-sans"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                Đặt lịch <span className="text-[#e61c5c] italic font-medium">Hẹn trao đổi</span>
                            </h3>
                            <p className="text-xs text-[#a0a5b5] font-sans">
                                Chọn khung giờ mong muốn. Quản trị viên sẽ xem xét và gửi email xác nhận sau khi tiếp nhận yêu cầu.
                            </p>
                        </div>

                        {status === "error" && (
                            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-sans">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Họ và tên *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        placeholder="0901234567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Địa chỉ Email *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="email@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" /> Ngày hẹn *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={minDate}
                                        value={date}
                                        onChange={(e) => {
                                            const nextDate = e.target.value
                                            setDate(nextDate)
                                            setUnavailable([])
                                            setAvailabilityStatus(nextDate ? "loading" : "idle")
                                        }}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all dark:scheme-dark"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> Khung giờ *
                                    </label>
                                    <select
                                        value={timeBlock}
                                        onChange={(e) => setTimeBlock(e.target.value)}
                                        disabled={!date || availabilityStatus === "loading"}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white focus:border-[#e61c5c]/50 focus:outline-none transition-all select-dark"
                                    >
                                        {timeBlocks.map((block) => (
                                            <option key={block} className="text-black" value={block} disabled={unavailable.includes(block)}>
                                                {block}{unavailable.includes(block) ? " — Đã có người đặt" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    {availabilityStatus === "loading" && <p className="text-[10px] text-muted-foreground">Đang kiểm tra lịch trống...</p>}
                                    {availabilityStatus === "error" && <p className="text-[10px] text-red-400">Không tải được lịch trống. Vui lòng thử lại.</p>}
                                    {date && unavailable.length === timeBlocks.length && <p className="text-[10px] text-red-400">Ngày này đã hết khung giờ.</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Lời nhắn hoặc câu hỏi</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tôi muốn tìm hiểu thêm về cách tiếp cận đầu tư giá trị hoặc xây dựng tư duy phân tích doanh nghiệp..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all resize-none"
                                />
                            </div>

                            <TurnstileWidget
                                siteKey={turnstileSiteKey}
                                onToken={handleCaptchaToken}
                                resetKey={captchaResetKey}
                            />

                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Thông tin bạn gửi chỉ được dùng để xử lý và xác nhận lịch hẹn; không dùng cho marketing nếu chưa có sự đồng ý của bạn.
                            </p>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === "submitting"
                                        || availabilityStatus === "loading"
                                        || unavailable.includes(timeBlock)
                                        || unavailable.length === timeBlocks.length
                                        || (process.env.NODE_ENV === "production" && !turnstileSiteKey)
                                        || Boolean(turnstileSiteKey && !captchaToken)}
                                    className="w-full h-12 rounded-full bg-[#9c1850] hover:bg-[#861244] text-white font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {status === "submitting" ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Đang gửi yêu cầu...
                                        </span>
                                    ) : (
                                        "Gửi yêu cầu đặt lịch"
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

export function BookingModal() {
    return (
        <Suspense fallback={null}>
            <BookingModalContent />
        </Suspense>
    )
}
