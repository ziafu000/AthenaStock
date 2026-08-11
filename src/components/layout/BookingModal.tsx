"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"

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
    const [timeBlock, setTimeBlock] = useState("09:00 - 10:00 (Sáng)")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")
    const [minDate] = useState(() => addDaysToDateOnly(vietnamDateFormatter.format(new Date()), 1))

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
        setTimeBlock("09:00 - 10:00 (Sáng)")
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
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
            } else {
                setStatus("error")
                setErrorMessage(data.error || "Có lỗi xảy ra khi đặt lịch.")
            }
        } catch {
            setStatus("error")
            setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
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
                            Chào <strong className="text-white">{name}</strong>, chúng tôi đã tiếp nhận yêu cầu và gửi email thông báo phê duyệt tới quản trị viên.
                        </p>
                        <p className="text-xs text-[#e61c5c] font-semibold bg-[#e61c5c]/5 border border-[#e61c5c]/10 py-2.5 px-4 rounded-xl inline-block max-w-xs font-sans">
                            Athena Stock sẽ phản hồi xác nhận lịch hẹn vào hòm thư email của bạn sớm nhất trong vòng 24 giờ.
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
                                Nhập khung giờ rảnh mong muốn. Chúng tôi sẽ xử lý yêu cầu và gửi email xác nhận cho bạn.
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
                                        onChange={(e) => setDate(e.target.value)}
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
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white focus:border-[#e61c5c]/50 focus:outline-none transition-all select-dark"
                                    >
                                        <option className="text-black" value="09:00 - 10:00 (Sáng)">09:00 - 10:00 (Sáng)</option>
                                        <option className="text-black" value="10:00 - 11:00 (Sáng)">10:00 - 11:00 (Sáng)</option>
                                        <option className="text-black" value="14:00 - 15:00 (Chiều)">14:00 - 15:00 (Chiều)</option>
                                        <option className="text-black" value="15:00 - 16:00 (Chiều)">15:00 - 16:00 (Chiều)</option>
                                        <option className="text-black" value="16:00 - 17:00 (Chiều)">16:00 - 17:00 (Chiều)</option>
                                        <option className="text-black" value="19:30 - 20:30 (Tối)">19:30 - 20:30 (Tối)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Lời nhắn hoặc câu hỏi</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tôi muốn tìm hiểu thêm về định giá cổ phiếu hoặc cách review danh mục..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white placeholder-muted-foreground/60 focus:border-[#e61c5c]/50 focus:outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
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
