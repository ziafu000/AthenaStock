"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
    Crown,
    Mail,
    Phone,
    Calendar,
    Sparkles,
    TrendingUp,
    ListFilter,
    CreditCard,
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    LogOut,
    Lock,
    Loader2,
} from "lucide-react"
import { VipUpgradeModal } from "@/components/vip/VipUpgradeModal"
import { WATCHLIST_STATUSES } from "@/lib/member/types"
import type {
    Member,
    WatchlistItem,
    WatchlistStatus,
    PortfolioSummary,
    VipPaymentRequest,
} from "@/lib/member/types"

export default function ProfilePage() {
    const [member, setMember] = useState<Member | null>(null)
    const [loadingMember, setLoadingMember] = useState(true)
    const [activeTab, setActiveTab] = useState<"watchlist" | "portfolio" | "billing">("watchlist")
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

    // Auth Form states (if not logged in)
    const [authMode, setAuthMode] = useState<"login" | "register">("login")
    const [authEmail, setAuthEmail] = useState("")
    const [authFullName, setAuthFullName] = useState("")
    const [authPhone, setAuthPhone] = useState("")
    const [authError, setAuthError] = useState("")
    const [authLoading, setAuthLoading] = useState(false)

    // Watchlist states
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [newTicker, setNewTicker] = useState("")
    const [newStatus, setNewStatus] = useState<WatchlistStatus>("Đang theo dõi")
    const [newNotes, setNewNotes] = useState("")
    const [watchlistLoading, setWatchlistLoading] = useState(false)

    // Portfolio states
    const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null)
    const [holdingTicker, setHoldingTicker] = useState("")
    const [holdingShares, setHoldingShares] = useState("")
    const [holdingCost, setHoldingCost] = useState("")
    const [holdingNotes, setHoldingNotes] = useState("")
    const [portfolioLoading, setPortfolioLoading] = useState(false)
    const [portfolioError, setPortfolioError] = useState("")

    // Billing history states
    const [paymentRequests, setPaymentRequests] = useState<VipPaymentRequest[]>([])

    const loadMember = useCallback(async () => {
        setLoadingMember(true)
        try {
            const res = await fetch("/api/member/auth", { cache: "no-store" })
            const data = await res.json()
            if (data.authenticated && data.member) {
                setMember(data.member)
            } else {
                setMember(null)
            }
        } catch {
            setMember(null)
        } finally {
            setLoadingMember(false)
        }
    }, [])

    const loadWatchlist = useCallback(async () => {
        try {
            const res = await fetch("/api/member/watchlist", { cache: "no-store" })
            if (res.ok) {
                const data = await res.json()
                setWatchlist(data.items || [])
            }
        } catch {
            // Ignore
        }
    }, [])

    const loadPortfolio = useCallback(async () => {
        setPortfolioLoading(true)
        setPortfolioError("")
        try {
            const res = await fetch("/api/member/portfolio", { cache: "no-store" })
            if (res.ok) {
                const data = await res.json()
                setPortfolioSummary(data)
            } else if (res.status === 403) {
                setPortfolioSummary(null)
            }
        } catch {
            // Ignore
        } finally {
            setPortfolioLoading(false)
        }
    }, [])

    const loadPaymentRequests = useCallback(async () => {
        try {
            const res = await fetch("/api/member/payment-requests", { cache: "no-store" })
            if (res.ok) {
                const data = await res.json()
                setPaymentRequests(data.requests || [])
            }
        } catch {
            // Ignore
        }
    }, [])

    useEffect(() => {
        void loadMember()
    }, [loadMember])

    useEffect(() => {
        if (member) {
            void loadWatchlist()
            if (member.tier === "vip") {
                void loadPortfolio()
            }
            void loadPaymentRequests()
        }
    }, [member, loadWatchlist, loadPortfolio, loadPaymentRequests])

    async function handleAuthSubmit(e: React.FormEvent) {
        e.preventDefault()
        setAuthError("")
        setAuthLoading(true)

        try {
            const res = await fetch("/api/member/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: authMode,
                    email: authEmail,
                    full_name: authFullName,
                    phone: authPhone,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Xác thực không thành công.")
            }

            setMember(data.member)
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setAuthLoading(false)
        }
    }

    async function handleLogout() {
        await fetch("/api/member/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" }),
        })
        setMember(null)
    }

    async function handleAddWatchlist(e: React.FormEvent) {
        e.preventDefault()
        if (!newTicker.trim()) return
        setWatchlistLoading(true)

        try {
            const res = await fetch("/api/member/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker: newTicker,
                    status: newStatus,
                    notes: newNotes,
                }),
            })

            if (res.ok) {
                setNewTicker("")
                setNewNotes("")
                await loadWatchlist()
            }
        } catch {
            // Ignore
        } finally {
            setWatchlistLoading(false)
        }
    }

    async function handleRemoveWatchlist(ticker: string) {
        try {
            await fetch(`/api/member/watchlist?ticker=${encodeURIComponent(ticker)}`, { method: "DELETE" })
            await loadWatchlist()
        } catch {
            // Ignore
        }
    }

    async function handleUpdateWatchlistStatus(item: WatchlistItem, nextStatus: WatchlistStatus) {
        try {
            await fetch("/api/member/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker: item.ticker,
                    status: nextStatus,
                    notes: item.notes,
                }),
            })
            await loadWatchlist()
        } catch {
            // Ignore
        }
    }

    async function handleAddHolding(e: React.FormEvent) {
        e.preventDefault()
        setPortfolioLoading(true)
        setPortfolioError("")

        try {
            const res = await fetch("/api/member/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker: holdingTicker,
                    shares: parseFloat(holdingShares),
                    cost_basis: parseFloat(holdingCost),
                    notes: holdingNotes,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Không thể thêm cổ phiếu.")
            }

            setHoldingTicker("")
            setHoldingShares("")
            setHoldingCost("")
            setHoldingNotes("")
            await loadPortfolio()
        } catch (err) {
            setPortfolioError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setPortfolioLoading(false)
        }
    }

    async function handleRemoveHolding(ticker: string) {
        try {
            await fetch(`/api/member/portfolio?ticker=${encodeURIComponent(ticker)}`, { method: "DELETE" })
            await loadPortfolio()
        } catch {
            // Ignore
        }
    }

    const isVip = member?.tier === "vip" && (!member.vip_expires_at || new Date(member.vip_expires_at).getTime() > Date.now())

    if (loadingMember) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="text-sm text-muted-foreground">Đang tải thông tin thành viên...</p>
            </div>
        )
    }

    // IF NOT LOGGED IN: Render Login/Registration Form
    if (!member) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-4 max-w-md mx-auto">
                <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-background p-6 md:p-8 shadow-xl">
                    <div className="text-center space-y-2 mb-6">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span>CỘNG ĐỒNG ATHENAN</span>
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-foreground">
                            {authMode === "login" ? "Đăng nhập tài khoản" : "Đăng ký thành viên"}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Quản lý Watchlist, Danh mục cá nhân và các đặc quyền VIP.
                        </p>
                    </div>

                    <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setAuthMode("login")}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                authMode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode("register")}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                authMode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Đăng ký mới
                        </button>
                    </div>

                    {authError && (
                        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {authMode === "register" && (
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={authFullName}
                                    onChange={(e) => setAuthFullName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                            />
                        </div>

                        {authMode === "register" && (
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Số điện thoại (tuỳ chọn)
                                </label>
                                <input
                                    type="tel"
                                    value={authPhone}
                                    onChange={(e) => setAuthPhone(e.target.value)}
                                    placeholder="0901234567"
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {authLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span>{authMode === "login" ? "Đăng nhập ngay" : "Tạo tài khoản"}</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // LOGGED-IN VIEW: Full Dashboard
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
            {/* Top Member Card */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-800 bg-background p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-start md:items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground font-serif font-bold text-xl border border-border shrink-0">
                            {member.full_name ? member.full_name.charAt(0).toUpperCase() : "A"}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground">
                                    {member.full_name}
                                </h1>

                                {isVip ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-rose-500/20 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-sm">
                                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                                        <span>VIP MEMBER</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 dark:border-stone-700 bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                        NORMAL MEMBER
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <span className="inline-flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {member.email}
                                </span>
                                {member.phone && (
                                    <span className="inline-flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5" />
                                        {member.phone}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Gia nhập: {new Date(member.created_at).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* VIP Status Action */}
                    <div className="flex items-center gap-3">
                        {isVip ? (
                            <div className="flex flex-col md:items-end gap-1.5">
                                <span className="text-xs text-muted-foreground">
                                    Hạn VIP:{" "}
                                    <strong className="text-foreground">
                                        {member.vip_expires_at
                                            ? new Date(member.vip_expires_at).toLocaleDateString("vi-VN")
                                            : "Vô thời hạn"}
                                    </strong>
                                </span>
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-all"
                                >
                                    Gia hạn VIP
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all"
                            >
                                <Crown className="h-4 w-4" />
                                <span>Nâng cấp VIP</span>
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                            title="Đăng xuất"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-2 border-b border-border pb-3">
                <button
                    onClick={() => setActiveTab("watchlist")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "watchlist"
                            ? "bg-secondary text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <ListFilter className="h-4 w-4" />
                    <span>Watchlist cá nhân</span>
                    <span className="rounded-full bg-background px-2 py-0.5 text-xs border border-border">
                        {watchlist.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("portfolio")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "portfolio"
                            ? "bg-secondary text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span>Portfolio (VIP)</span>
                    {!isVip && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                </button>

                <button
                    onClick={() => setActiveTab("billing")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "billing"
                            ? "bg-secondary text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <CreditCard className="h-4 w-4" />
                    <span>Lịch sử thanh toán</span>
                    {paymentRequests.length > 0 && (
                        <span className="rounded-full bg-background px-2 py-0.5 text-xs border border-border">
                            {paymentRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* TAB 1: WATCHLIST */}
            {activeTab === "watchlist" && (
                <div className="space-y-6">
                    {/* Add to Watchlist Form */}
                    <form onSubmit={handleAddWatchlist} className="rounded-2xl border border-border bg-secondary/20 p-4 md:p-5">
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                required
                                value={newTicker}
                                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                                placeholder="Mã cổ phiếu (VD: FPT, HPG)"
                                className="w-full md:w-48 rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono font-bold uppercase focus:border-amber-500 focus:outline-none"
                            />

                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as WatchlistStatus)}
                                className="w-full md:w-56 rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                            >
                                {WATCHLIST_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                        {st}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={newNotes}
                                onChange={(e) => setNewNotes(e.target.value)}
                                placeholder="Ghi chú luận điểm theo dõi (không bắt buộc)..."
                                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                            />

                            <button
                                type="submit"
                                disabled={watchlistLoading || !newTicker.trim()}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Thêm mã</span>
                            </button>
                        </div>
                    </form>

                    {/* Watchlist Table */}
                    {watchlist.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border rounded-2xl p-8 space-y-2">
                            <p className="text-sm font-serif text-muted-foreground">
                                Bạn chưa theo dõi mã cổ phiếu nào trong danh sách.
                            </p>
                            <p className="text-xs text-stone-500">
                                Nhập mã cổ phiếu ở trên để bắt đầu theo dõi tiến độ nghiên cứu doanh nghiệp.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3">Mã CP</th>
                                        <th className="px-4 py-3">Trạng thái nghiên cứu</th>
                                        <th className="px-4 py-3">Ghi chú</th>
                                        <th className="px-4 py-3">Cập nhật</th>
                                        <th className="px-4 py-3 text-right">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {watchlist.map((item) => (
                                        <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                                            <td className="px-4 py-3.5 font-mono font-bold text-foreground">
                                                <Link
                                                    href={`/business/${item.ticker.toLowerCase()}`}
                                                    className="hover:text-amber-600 hover:underline"
                                                >
                                                    {item.ticker}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdateWatchlistStatus(item, e.target.value as WatchlistStatus)}
                                                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                                                >
                                                    {WATCHLIST_STATUSES.map((st) => (
                                                        <option key={st} value={st}>
                                                            {st}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-xs truncate">
                                                {item.notes || "—"}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-stone-500">
                                                {new Date(item.updated_at).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => handleRemoveWatchlist(item.ticker)}
                                                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                                                    title="Xóa khỏi Watchlist"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: PORTFOLIO (VIP ONLY) */}
            {activeTab === "portfolio" && (
                <div className="space-y-6">
                    {!isVip ? (
                        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-rose-500/10 p-8 text-center max-w-xl mx-auto space-y-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                <Lock className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground">
                                Quản lý Portfolio cá nhân dành riêng cho VIP
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Theo dõi phân bổ tỷ trọng 1 danh mục chính, tính toán lãi/lỗ tự động và quản trị rủi ro tập trung cho danh mục đầu tư giá trị của bạn.
                            </p>
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all cursor-pointer"
                                >
                                    <Crown className="h-4 w-4" />
                                    <span>Nâng cấp VIP để mở khóa Portfolio</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Metrics Cards */}
                            {portfolioSummary && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-1">
                                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                            Tổng vốn đầu tư
                                        </span>
                                        <div className="text-lg md:text-xl font-bold font-mono text-foreground">
                                            {portfolioSummary.total_cost.toLocaleString("vi-VN")} đ
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-1">
                                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                            Giá trị thị trường
                                        </span>
                                        <div className="text-lg md:text-xl font-bold font-mono text-foreground">
                                            {portfolioSummary.total_market_value.toLocaleString("vi-VN")} đ
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-1">
                                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                            Tổng Lãi / Lỗ
                                        </span>
                                        <div className={`text-lg md:text-xl font-bold font-mono flex items-center gap-1 ${
                                            portfolioSummary.total_gain_loss >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                        }`}>
                                            {portfolioSummary.total_gain_loss >= 0 ? (
                                                <ArrowUpRight className="h-4 w-4 shrink-0" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 shrink-0" />
                                            )}
                                            <span>{portfolioSummary.total_gain_loss.toLocaleString("vi-VN")} đ</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-1">
                                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                            Hiệu suất danh mục
                                        </span>
                                        <div className={`text-lg md:text-xl font-bold font-mono ${
                                            portfolioSummary.total_gain_loss_percent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                        }`}>
                                            {portfolioSummary.total_gain_loss_percent >= 0 ? "+" : ""}
                                            {portfolioSummary.total_gain_loss_percent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add Holding Form */}
                            <form onSubmit={handleAddHolding} className="rounded-2xl border border-border bg-secondary/20 p-4 md:p-5">
                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                                    Thêm hoặc cập nhật cổ phiếu trong danh mục
                                </div>

                                {portfolioError && (
                                    <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-600">
                                        {portfolioError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                                    <input
                                        type="text"
                                        required
                                        value={holdingTicker}
                                        onChange={(e) => setHoldingTicker(e.target.value.toUpperCase())}
                                        placeholder="Mã CP (VD: FPT)"
                                        className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono font-bold uppercase focus:border-amber-500 focus:outline-none"
                                    />

                                    <input
                                        type="number"
                                        required
                                        step="any"
                                        value={holdingShares}
                                        onChange={(e) => setHoldingShares(e.target.value)}
                                        placeholder="Số lượng (VD: 1000)"
                                        className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono focus:border-amber-500 focus:outline-none"
                                    />

                                    <input
                                        type="number"
                                        required
                                        step="any"
                                        value={holdingCost}
                                        onChange={(e) => setHoldingCost(e.target.value)}
                                        placeholder="Giá vốn (VND/CP)"
                                        className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono focus:border-amber-500 focus:outline-none"
                                    />

                                    <input
                                        type="text"
                                        value={holdingNotes}
                                        onChange={(e) => setHoldingNotes(e.target.value)}
                                        placeholder="Ghi chú (tuỳ chọn)"
                                        className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={portfolioLoading || !holdingTicker || !holdingShares || !holdingCost}
                                        className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 py-2 text-sm font-semibold hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        Lưu cổ phiếu
                                    </button>
                                </div>
                            </form>

                            {/* Portfolio Holdings Table */}
                            {(!portfolioSummary || portfolioSummary.holdings.length === 0) ? (
                                <div className="text-center py-12 border border-dashed border-border rounded-2xl p-8 space-y-2">
                                    <p className="text-sm font-serif text-muted-foreground">
                                        Danh mục của bạn hiện đang trống.
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        Nhập mã cổ phiếu, số lượng và giá vốn ở form trên để hệ thống tính toán tỷ trọng và lãi/lỗ.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-border">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3">Mã CP</th>
                                                <th className="px-4 py-3 text-right">Số lượng</th>
                                                <th className="px-4 py-3 text-right">Giá vốn</th>
                                                <th className="px-4 py-3 text-right">Giá thị trường</th>
                                                <th className="px-4 py-3 text-right">Giá trị</th>
                                                <th className="px-4 py-3 text-right">Lãi / Lỗ</th>
                                                <th className="px-4 py-3 text-right">Tỷ trọng</th>
                                                <th className="px-4 py-3 text-right">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {portfolioSummary.holdings.map((h) => (
                                                <tr key={h.id} className="hover:bg-secondary/10 transition-colors">
                                                    <td className="px-4 py-3.5 font-mono font-bold text-foreground">
                                                        <Link href={`/business/${h.ticker.toLowerCase()}`} className="hover:underline hover:text-amber-600">
                                                            {h.ticker}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-mono">{h.shares.toLocaleString("vi-VN")}</td>
                                                    <td className="px-4 py-3.5 text-right font-mono">{h.cost_basis.toLocaleString("vi-VN")} đ</td>
                                                    <td className="px-4 py-3.5 text-right font-mono">{h.market_price.toLocaleString("vi-VN")} đ</td>
                                                    <td className="px-4 py-3.5 text-right font-mono font-semibold">{h.market_value.toLocaleString("vi-VN")} đ</td>
                                                    <td className={`px-4 py-3.5 text-right font-mono font-semibold ${
                                                        h.gain_loss >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                                    }`}>
                                                        {h.gain_loss >= 0 ? "+" : ""}{h.gain_loss.toLocaleString("vi-VN")} đ
                                                        <span className="text-[11px] ml-1">({h.gain_loss_percent >= 0 ? "+" : ""}{h.gain_loss_percent.toFixed(1)}%)</span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                                                            {h.weight.toFixed(1)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <button
                                                            onClick={() => handleRemoveHolding(h.ticker)}
                                                            className="text-stone-400 hover:text-red-600 transition-colors p-1"
                                                            title="Xóa khỏi danh mục"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: BILLING HISTORY */}
            {activeTab === "billing" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-serif font-bold text-foreground">
                            Lịch sử yêu cầu nâng cấp gói VIP
                        </h2>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-amber-600 hover:to-rose-700 transition-all"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Tạo yêu cầu mới</span>
                        </button>
                    </div>

                    {paymentRequests.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border rounded-2xl p-8 space-y-2">
                            <p className="text-sm font-serif text-muted-foreground">
                                Bạn chưa có yêu cầu thanh toán nào.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3">Mã GD</th>
                                        <th className="px-4 py-3">Thời hạn</th>
                                        <th className="px-4 py-3 text-right">Số tiền</th>
                                        <th className="px-4 py-3">Trạng thái</th>
                                        <th className="px-4 py-3">Ngày tạo</th>
                                        <th className="px-4 py-3">Ghi chú duyệt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {paymentRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-secondary/10 transition-colors">
                                            <td className="px-4 py-3.5 font-mono font-bold text-foreground">
                                                {req.transfer_code}
                                            </td>
                                            <td className="px-4 py-3.5 font-serif font-medium">
                                                {req.package_months} Tháng
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono font-semibold">
                                                {req.amount.toLocaleString("vi-VN")} đ
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {req.status === "approved" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Đã duyệt
                                                    </span>
                                                )}
                                                {req.status === "pending" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                        <Clock className="h-3 w-3" />
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                                {req.status === "rejected" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Từ chối
                                                    </span>
                                                )}
                                                {req.status === "more_info_needed" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Cần bổ sung bill
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-stone-500">
                                                {new Date(req.created_at).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                {req.notes || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for VIP Upgrade */}
            <VipUpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => {
                    setIsUpgradeModalOpen(false)
                    void loadMember()
                    void loadPaymentRequests()
                }}
            />
        </div>
    )
}
