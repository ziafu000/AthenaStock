"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Crown, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"

interface VipCountdownBannerProps {
    unlockAt: string
    onOpenUpgradeModal?: () => void
}

export function VipCountdownBanner({ unlockAt, onOpenUpgradeModal }: VipCountdownBannerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        hours: number
        minutes: number
        seconds: number
        isExpired: boolean
    }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false })

    useEffect(() => {
        const target = new Date(unlockAt).getTime()

        function calculate() {
            const now = Date.now()
            const diff = target - now

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ hours, minutes, seconds, isExpired: false })
        }

        calculate()
        const interval = setInterval(calculate, 1000)
        return () => clearInterval(interval)
    }, [unlockAt])

    if (timeLeft.isExpired) {
        return (
            <div className="my-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md">
                <p className="text-emerald-700 dark:text-emerald-300 font-serif font-medium">
                    Giai đoạn VIP-First 8h đã kết thúc. Bài viết đã được mở công khai cho tất cả độc giả. Vui lòng tải lại trang nếu cần.
                </p>
            </div>
        )
    }

    const pad = (n: number) => String(n).padStart(2, "0")

    return (
        <div className="relative my-8 overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-rose-500/10 p-6 md:p-8 backdrop-blur-md shadow-lg">
            {/* Ambient gold glow */}
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-rose-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                        <span>ĐẶC QUYỀN VIP-FIRST 8 GIỜ</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                        Bài viết đang trong giai đoạn phát hành sớm dành cho VIP
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 max-w-xl font-sans leading-relaxed">
                        Thành viên VIP AthenaStock được tiếp cận đầy đủ các luận điểm phân tích và cảnh báo rủi ro ngay khi xuất bản. Bài viết sẽ mở công khai cho thành viên Normal sau thời gian đếm ngược.
                    </p>
                </div>

                {/* Countdown display */}
                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                        <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                        <span>Mở công khai sau:</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center rounded-xl border border-amber-500/30 bg-stone-900/90 text-amber-400 px-3 py-2 min-w-[56px] shadow-sm">
                            <span className="font-mono text-2xl font-bold">{pad(timeLeft.hours)}</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Giờ</span>
                        </div>
                        <span className="text-xl font-bold text-amber-500">:</span>
                        <div className="flex flex-col items-center rounded-xl border border-amber-500/30 bg-stone-900/90 text-amber-400 px-3 py-2 min-w-[56px] shadow-sm">
                            <span className="font-mono text-2xl font-bold">{pad(timeLeft.minutes)}</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Phút</span>
                        </div>
                        <span className="text-xl font-bold text-amber-500">:</span>
                        <div className="flex flex-col items-center rounded-xl border border-amber-500/30 bg-stone-900/90 text-amber-400 px-3 py-2 min-w-[56px] shadow-sm">
                            <span className="font-mono text-2xl font-bold">{pad(timeLeft.seconds)}</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Giây</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        {onOpenUpgradeModal ? (
                            <button
                                onClick={onOpenUpgradeModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Đăng ký thành viên VIP</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <Link
                                href="/vip/upgrade"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Đăng ký thành viên VIP</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                    Bảo lưu quyền truy cập độc quyền cho hội viên VIP
                </span>
                <span className="italic">Thời gian mở: {new Date(unlockAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ({new Date(unlockAt).toLocaleDateString("vi-VN")})</span>
            </div>
        </div>
    )
}
