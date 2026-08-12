"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { CalendarDays, LogOut, RefreshCw } from "lucide-react"

type BookingStatus = "pending" | "confirmed" | "reschedule_requested" | "cancelled"

interface AdminBooking {
    id: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    bookingDate: string
    timeBlock: string
    status: BookingStatus
    meetingLocation: string | null
}

const statusLabels: Record<BookingStatus, string> = {
    pending: "Chờ duyệt",
    confirmed: "Đã xác nhận",
    reschedule_requested: "Đang đổi lịch",
    cancelled: "Đã hủy",
}

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("vi-VN")
}

export default function AdminBookingsPage() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [email, setEmail] = useState("")
    const [loginMessage, setLoginMessage] = useState("")
    const [status, setStatus] = useState<"" | BookingStatus>("")
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const loadBookings = useCallback(async (nextStatus: "" | BookingStatus) => {
        setLoading(true)
        setError("")
        try {
            const query = nextStatus ? `?status=${nextStatus}` : ""
            const response = await fetch(`/api/admin/bookings${query}`, { cache: "no-store" })
            if (response.status === 401) {
                setAuthenticated(false)
                return
            }
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể tải lịch hẹn.")
            setBookings(data.bookings as AdminBooking[])
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Không thể tải lịch hẹn.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        async function loadSession() {
            const response = await fetch("/api/admin/session", { cache: "no-store" })
            const data = await response.json() as { authenticated: boolean }
            setAuthenticated(data.authenticated)
            if (data.authenticated) await loadBookings("")
        }
        void loadSession()
    }, [loadBookings])

    async function requestLogin(event: FormEvent) {
        event.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await fetch("/api/admin/auth/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể gửi liên kết đăng nhập.")
            setLoginMessage(data.message)
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Không thể gửi liên kết đăng nhập.")
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        await fetch("/api/admin/session", { method: "DELETE" })
        setAuthenticated(false)
        setBookings([])
    }

    async function cancelBooking(booking: AdminBooking) {
        const reason = window.prompt(`Lý do hủy lịch của ${booking.customerName} (không bắt buộc):`, "")
        if (reason === null) return
        setLoading(true)
        setError("")
        try {
            const response = await fetch(`/api/admin/bookings/${booking.id}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể hủy lịch hẹn.")
            await loadBookings(status)
        } catch (cancelError) {
            setError(cancelError instanceof Error ? cancelError.message : "Không thể hủy lịch hẹn.")
            setLoading(false)
        }
    }

    if (authenticated === null) {
        return <div className="min-h-screen bg-[#090d16] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>
    }

    if (!authenticated) {
        return (
            <main className="min-h-screen bg-[#090d16] px-4 py-12 text-white">
                <form onSubmit={requestLogin} className="mx-auto max-w-md space-y-5 rounded-3xl border border-white/[0.08] p-7 shadow-2xl">
                    <Image src="/logo.png" alt="Athena Stock" width={90} height={90} className="mx-auto h-16 w-auto" />
                    <div className="text-center">
                        <h1 className="font-serif text-3xl font-bold">Quản trị booking</h1>
                        <p className="mt-2 text-sm text-[#a0a5b5]">Nhận liên kết đăng nhập một lần qua email quản trị.</p>
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email quản trị"
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 outline-none focus:border-[#e61c5c]/60"
                    />
                    {loginMessage && <p className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">{loginMessage}</p>}
                    {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
                    <button disabled={loading} className="h-12 w-full rounded-full bg-[#9c1850] font-semibold disabled:opacity-50">
                        {loading ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
                    </button>
                </form>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#090d16] px-4 py-8 text-white">
            <div className="mx-auto max-w-6xl space-y-6">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="text-[#e61c5c]" />
                        <div><h1 className="font-serif text-3xl font-bold">Danh sách booking</h1><p className="text-sm text-[#a0a5b5]">Tối đa 100 yêu cầu gần nhất</p></div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => loadBookings(status)} disabled={loading} className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm"><RefreshCw size={15} /> Làm mới</button>
                        <button onClick={logout} className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm"><LogOut size={15} /> Đăng xuất</button>
                    </div>
                </header>

                <div className="flex flex-wrap gap-2">
                    {(["", "pending", "confirmed", "reschedule_requested", "cancelled"] as const).map((value) => (
                        <button
                            key={value || "all"}
                            onClick={() => { setStatus(value); void loadBookings(value) }}
                            className={`rounded-full border px-4 py-2 text-xs ${status === value ? "border-[#e61c5c] bg-[#e61c5c]/10" : "border-white/10"}`}
                        >
                            {value ? statusLabels[value] : "Tất cả"}
                        </button>
                    ))}
                </div>

                {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

                <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-white/[0.04] text-xs uppercase text-[#a0a5b5]"><tr><th className="p-4">Khách hàng</th><th className="p-4">Lịch</th><th className="p-4">Trạng thái</th><th className="p-4">Phòng họp</th><th className="p-4 text-right">Thao tác</th></tr></thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-t border-white/[0.06]">
                                    <td className="p-4"><p className="font-semibold">{booking.customerName}</p><p className="mt-1 text-xs text-[#a0a5b5]">{booking.customerEmail}{booking.customerPhone ? ` · ${booking.customerPhone}` : ""}</p></td>
                                    <td className="p-4"><p>{formatDate(booking.bookingDate)}</p><p className="mt-1 text-xs text-[#a0a5b5]">{booking.timeBlock}</p></td>
                                    <td className="p-4"><span className="rounded-full border border-white/10 px-3 py-1 text-xs">{statusLabels[booking.status]}</span></td>
                                    <td className="max-w-52 truncate p-4 text-xs text-[#a0a5b5]">{booking.meetingLocation || "—"}</td>
                                    <td className="p-4 text-right">{booking.status !== "cancelled" && <button onClick={() => cancelBooking(booking)} className="text-xs font-semibold text-red-400 hover:underline">Hủy lịch</button>}</td>
                                </tr>
                            ))}
                            {!loading && bookings.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-[#a0a5b5]">Không có booking phù hợp.</td></tr>}
                            {loading && <tr><td colSpan={5} className="p-10 text-center text-[#a0a5b5]">Đang tải...</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
