"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    CalendarDays,
    Crown,
    LogOut,
    RefreshCw,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Eye,
    X,
    Shield,
    Clock,
    Loader2,
} from "lucide-react"
import type { VipPaymentRequest, MembershipAuditLog } from "@/lib/member/types"

interface AdminVipRequestItem extends VipPaymentRequest {
    member_name: string
    member_email: string
    member_phone: string | null
    current_tier: string
    member_vip_expires_at: string | null
}

interface AdminVipStats {
    pending: number
    approved: number
    rejected: number
    moreInfoNeeded: number
    totalMembers: number
    vipMembers: number
}

export default function AdminVipPage() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [email, setEmail] = useState("")
    const [loginMessage, setLoginMessage] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("pending")
    const [requests, setRequests] = useState<AdminVipRequestItem[]>([])
    const [stats, setStats] = useState<AdminVipStats | null>(null)
    const [auditLogs, setAuditLogs] = useState<MembershipAuditLog[]>([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState("")
    const [activeBillImage, setActiveBillImage] = useState<string | null>(null)
    const [loadingBillId, setLoadingBillId] = useState<string | null>(null)

    async function handleViewBill(requestId: string) {
        setLoadingBillId(requestId)
        try {
            const res = await fetch(`/api/admin/vip/requests?id=${requestId}`, { cache: "no-store" })
            const data = await res.json()
            if (data.proof_image_data) {
                setActiveBillImage(data.proof_image_data)
            } else {
                alert("Không tìm thấy hình ảnh biên lai thanh toán.")
            }
        } catch {
            alert("Không thể tải hình ảnh biên lai.")
        } finally {
            setLoadingBillId(null)
        }
    }

    const loadData = useCallback(async (currentStatus: string) => {
        setLoading(true)
        setError("")
        try {
            const query = currentStatus && currentStatus !== "all" ? `?status=${currentStatus}` : ""
            const response = await fetch(`/api/admin/vip/requests${query}`, { cache: "no-store" })
            if (response.status === 401) {
                setAuthenticated(false)
                return
            }
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Không thể tải danh sách VIP.")
            setRequests(data.requests as AdminVipRequestItem[])
            setStats(data.stats as AdminVipStats)
            setAuditLogs(data.auditLogs as MembershipAuditLog[])
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        async function loadSession() {
            const response = await fetch("/api/admin/session", { cache: "no-store" })
            const data = (await response.json()) as { authenticated: boolean }
            setAuthenticated(data.authenticated)
            if (data.authenticated) await loadData(statusFilter)
        }
        void loadSession()
    }, [loadData, statusFilter])

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
            setError(loginError instanceof Error ? loginError.message : "Không thể gửi liên kết.")
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        await fetch("/api/admin/session", { method: "DELETE" })
        setAuthenticated(false)
        setRequests([])
    }

    async function handleApprove(req: AdminVipRequestItem) {
        const confirmMsg = `Xác nhận duyệt kích hoạt VIP ${req.package_months} tháng cho thành viên "${req.member_name}" (${req.member_email})?`
        if (!window.confirm(confirmMsg)) return

        setActionLoading(true)
        setError("")
        try {
            const res = await fetch("/api/admin/vip/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: req.id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Không thể duyệt yêu cầu.")
            await loadData(statusFilter)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setActionLoading(false)
        }
    }

    async function handleReject(req: AdminVipRequestItem, targetStatus: "rejected" | "more_info_needed") {
        const promptLabel = targetStatus === "rejected" ? "Lý do từ chối yêu cầu:" : "Nội dung cần yêu cầu bổ sung:"
        const reason = window.prompt(promptLabel, "")
        if (reason === null) return

        setActionLoading(true)
        setError("")
        try {
            const res = await fetch("/api/admin/vip/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: req.id, status: targetStatus, reason }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Không thể xử lý yêu cầu.")
            await loadData(statusFilter)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setActionLoading(false)
        }
    }

    // Unauthenticated View: Admin Login Form
    if (authenticated === false) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 max-w-md mx-auto">
                <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-background p-6 md:p-8 shadow-xl">
                    <div className="text-center space-y-2 mb-6">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <Shield className="h-3.5 w-3.5 text-amber-500" />
                            <span>ATHENASTOCK ADMIN</span>
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-foreground">
                            Quản trị Hội viên VIP
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Đăng nhập bằng email quản trị viên để duyệt yêu cầu thanh toán.
                        </p>
                    </div>

                    {loginMessage ? (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed text-center">
                            {loginMessage}
                        </div>
                    ) : (
                        <form onSubmit={requestLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Email quản trị viên *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@athenastock.com"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                <span>Gửi mã đăng nhập</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                        <Crown className="h-4 w-4" />
                        <span>Hệ thống Quản trị VIP AthenaStock</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                        Duyệt Yêu cầu Nâng cấp VIP
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/bookings"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span>Lịch hẹn Tư vấn</span>
                    </Link>

                    <button
                        onClick={() => void loadData(statusFilter)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>

                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                            <span className="text-xs font-semibold uppercase">Chờ duyệt</span>
                            <Clock className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                            {stats.pending}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                            <span className="text-xs font-semibold uppercase">Đã duyệt</span>
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {stats.approved}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 space-y-1">
                        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
                            <span className="text-xs font-semibold uppercase">Từ chối</span>
                            <XCircle className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
                            {stats.rejected}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-1">
                        <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                            <span className="text-xs font-semibold uppercase">Cần bổ sung</span>
                            <HelpCircle className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                            {stats.moreInfoNeeded}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-stone-300 dark:border-stone-700 bg-secondary/30 p-4 space-y-1 col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-semibold uppercase">Hội viên VIP</span>
                            <Crown className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-foreground">
                            {stats.vipMembers} / {stats.totalMembers}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
                {[
                    { id: "pending", label: "Chờ duyệt" },
                    { id: "approved", label: "Đã duyệt" },
                    { id: "more_info_needed", label: "Cần bổ sung" },
                    { id: "rejected", label: "Từ chối" },
                    { id: "all", label: "Tất cả yêu cầu" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                            statusFilter === tab.id
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
                    {error}
                </div>
            )}

            {/* Requests Table */}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border rounded-2xl p-8 space-y-2">
                        <p className="text-sm font-serif text-muted-foreground">
                            Không có yêu cầu thanh toán nào trong mục này.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-border">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Mã Chuyển khoản</th>
                                    <th className="px-4 py-3">Thành viên</th>
                                    <th className="px-4 py-3">Gói</th>
                                    <th className="px-4 py-3 text-right">Số tiền</th>
                                    <th className="px-4 py-3">Biên lai</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3">Ngày tạo</th>
                                    <th className="px-4 py-3 text-right">Thao tác duyệt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-secondary/10 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                                {req.transfer_code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-foreground">{req.member_name}</div>
                                            <div className="text-xs text-muted-foreground">{req.member_email}</div>
                                            {req.member_phone && (
                                                <div className="text-xs text-stone-500">{req.member_phone}</div>
                                            )}
                                            <div className="text-[10px] text-stone-400 mt-0.5">
                                                Hạng: <span className="uppercase font-semibold">{req.current_tier}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium">
                                            {req.package_months} Tháng
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono font-bold text-foreground">
                                            {req.amount.toLocaleString("vi-VN")} đ
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {req.has_proof || req.proof_image_data ? (
                                                <button
                                                    onClick={() => void handleViewBill(req.id)}
                                                    disabled={loadingBillId === req.id}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary transition-all disabled:opacity-50"
                                                >
                                                    {loadingBillId === req.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5 text-amber-500" />
                                                    )}
                                                    <span>Xem Bill</span>
                                                </button>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Chưa tải</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {req.status === "approved" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Đã duyệt
                                                </span>
                                            )}
                                            {req.status === "pending" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                    Chờ duyệt
                                                </span>
                                            )}
                                            {req.status === "rejected" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                                    Từ chối
                                                </span>
                                            )}
                                            {req.status === "more_info_needed" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                    Cần bổ sung
                                                </span>
                                            )}
                                            {req.notes && (
                                                <div className="text-[11px] text-muted-foreground mt-1 max-w-xs truncate">
                                                    Lý do: {req.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-stone-500">
                                            {new Date(req.created_at).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                            {req.status !== "approved" && (
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    disabled={actionLoading}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold hover:bg-emerald-700 transition-all cursor-pointer"
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Duyệt VIP</span>
                                                </button>
                                            )}

                                            {req.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleReject(req, "more_info_needed")}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 text-blue-600 hover:bg-blue-500/10 px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer"
                                                    >
                                                        <span>Yêu cầu bổ sung</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(req, "rejected")}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer"
                                                    >
                                                        <span>Từ chối</span>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Audit Log Section */}
            {auditLogs.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-border">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Nhật ký kiểm toán (Membership Audit Logs)
                    </h2>

                    <div className="rounded-2xl border border-border overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-secondary/40 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-4 py-2.5">Thời gian</th>
                                    <th className="px-4 py-2.5">Tác tử (Actor)</th>
                                    <th className="px-4 py-2.5">Hành động</th>
                                    <th className="px-4 py-2.5">Mục tiêu</th>
                                    <th className="px-4 py-2.5">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-secondary/10">
                                        <td className="px-4 py-2 text-stone-500 font-mono">
                                            {new Date(log.created_at).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            <span className="uppercase text-[10px] bg-secondary px-1.5 py-0.5 rounded mr-1">
                                                {log.actor_type}
                                            </span>
                                            {log.actor_id}
                                        </td>
                                        <td className="px-4 py-2 font-semibold text-foreground">
                                            {log.action}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {log.target_type}: {log.target_id}
                                        </td>
                                        <td className="px-4 py-2 text-stone-400 font-mono text-[11px] max-w-sm truncate">
                                            {JSON.stringify(log.details)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal for viewing Proof Bill */}
            {activeBillImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative max-w-2xl w-full rounded-2xl bg-background p-4 border border-border shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <h3 className="font-serif font-bold text-base text-foreground">
                                Biên lai thanh toán chuyển khoản
                            </h3>
                            <button
                                onClick={() => setActiveBillImage(null)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative h-[65vh] w-full rounded-xl overflow-hidden bg-black/50">
                            <Image
                                src={activeBillImage}
                                alt="Biên lai chuyển khoản"
                                fill
                                sizes="100vw"
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
