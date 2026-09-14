"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Crown,
    CheckCircle2,
    Shield,
    TrendingUp,
    Clock,
    ArrowRight,
    Copy,
    Check,
    Upload,
    Loader2,
} from "lucide-react"
import { VIP_PACKAGES } from "@/lib/member/types"
import type { VipPackage, VipPaymentRequest } from "@/lib/member/types"

export default function VipUpgradePage() {
    const [selectedPackage, setSelectedPackage] = useState<VipPackage>(VIP_PACKAGES[1])
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [createdRequest, setCreatedRequest] = useState<(VipPaymentRequest & { qr_code_url?: string }) | null>(null)
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [proofPreview, setProofPreview] = useState<string | null>(null)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/member/auth")
                const data = await res.json()
                if (data.authenticated && data.member) {
                    setFullName(data.member.full_name || "")
                    setEmail(data.member.email || "")
                    setPhone(data.member.phone || "")
                }
            } catch {
                // Ignore
            }
        }
        void loadUser()
    }, [])

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    async function handleCreateRequest(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/vip/create-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    package_id: selectedPackage.id,
                    full_name: fullName,
                    email,
                    phone,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Không thể tạo yêu cầu thanh toán.")
            }

            setCreatedRequest(data.request)
            setStep(2)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setLoading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Dung lượng hình ảnh vượt quá 5MB. Vui lòng chọn tệp nhỏ hơn.")
                return
            }
            if (!file.type.startsWith("image/")) {
                setError("Chỉ chấp nhận tệp hình ảnh.")
                return
            }
            setProofFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setProofPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleUploadProof() {
        if (!createdRequest) return
        if (!proofFile && !proofPreview) {
            setError("Vui lòng chọn hình ảnh chuyển khoản.")
            return
        }

        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/vip/upload-proof", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: createdRequest.id,
                    proofImageData: proofPreview,
                    uploadToken: createdRequest.upload_token,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Không thể tải lên biên lai.")
            }

            setStep(3)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
            {/* Header Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>ATHENASTOCK VIP MEMBERSHIP</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                    Đặc quyền thông tin. <br />
                    <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                        Quyết định đầu tư sáng suốt.
                    </span>
                </h1>

                <p className="text-base md:text-lg text-muted-foreground font-serif leading-relaxed">
                    Trở thành hội viên VIP để tiếp cận báo cáo nghiên cứu trước thị trường 8 giờ, theo dõi danh mục đầu tư cá nhân với tính toán tỷ trọng độc quyền.
                </p>
            </div>

            {/* Feature Perks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="rounded-2xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/40 p-6 space-y-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground">VIP-First 8 Giờ</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Toàn quyền xem ngay báo cáo phân tích doanh nghiệp chuyên sâu ngay khi xuất bản, trước cộng đồng 8 tiếng để chuẩn bị kế hoạch giao dịch.
                    </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/40 p-6 space-y-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground">Portfolio Quản Trị Danh Mục</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Theo dõi 1 danh mục đầu tư chính với phân bổ tỷ trọng %, quản lý giá vốn và tự động tính toán lãi/lỗ theo giá thị trường chuẩn.
                    </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/40 p-6 space-y-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground">Watchlist Phân Loại Sâu</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Lưu trữ và phân loại các mã cổ phiếu quan tâm với 5 trạng thái nghiên cứu chuyên nghiệp kèm ghi chú luận điểm riêng biệt.
                    </p>
                </div>
            </div>

            {/* Payment & Upgrade Workflow */}
            <div className="max-w-2xl mx-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-background p-6 md:p-10 shadow-xl">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                        <div>{error}</div>
                        {error.includes("đăng nhập") && (
                            <div className="mt-2">
                                <Link href="/profile" className="underline font-medium hover:opacity-80">
                                    Đi tới trang đăng nhập &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 1: Selection & Contact */}
                {step === 1 && (
                    <form onSubmit={handleCreateRequest} className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-serif font-bold text-foreground">
                                1. Chọn gói thời hạn hội viên
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Gói dài hạn giúp tiết kiệm chi phí và đồng hành trọn vẹn theo các kỳ công bố BCTC.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {VIP_PACKAGES.map((pkg) => {
                                const isSelected = selectedPackage.id === pkg.id
                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                                            isSelected
                                                ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30"
                                                : "border-border hover:border-stone-400 bg-secondary/10"
                                        }`}
                                    >
                                        {pkg.popular && (
                                            <span className="absolute -top-3 right-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                                Phổ biến nhất
                                            </span>
                                        )}
                                        {pkg.discountBadge && !pkg.popular && (
                                            <span className="absolute -top-3 right-3 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                                {pkg.discountBadge}
                                            </span>
                                        )}
                                        <div className="font-serif font-bold text-base text-foreground">{pkg.name}</div>
                                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                            {pkg.amount.toLocaleString("vi-VN")} đ
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 leading-snug">
                                            {pkg.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                2. Thông tin hội viên
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        Email nhận xác nhận *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        Số điện thoại (tuỳ chọn)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0901234567"
                                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:brightness-105 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Đang khởi tạo mã giao dịch...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Tiếp tục thanh toán ({selectedPackage.amount.toLocaleString("vi-VN")} đ)</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: VietQR & Payment details */}
                {step === 2 && createdRequest && (
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-serif font-bold text-foreground">
                                Quét mã VietQR hoặc chuyển khoản
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Vui lòng chuyển khoản đúng số tiền và nội dung chuyển khoản để hệ thống đối soát tự động.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-4 shadow-sm">
                                {createdRequest.qr_code_url ? (
                                    <div className="relative h-60 w-60">
                                        <Image
                                            src={createdRequest.qr_code_url}
                                            alt="VietQR code"
                                            fill
                                            sizes="240px"
                                            className="object-contain"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="h-60 w-60 flex items-center justify-center text-xs text-stone-500">
                                        Không tải được mã QR
                                    </div>
                                )}
                                <span className="text-xs text-stone-500 mt-2 font-mono">Quét mã bằng mọi App Ngân hàng</span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Ngân hàng:</span>
                                        <span className="font-semibold text-foreground text-sm">{createdRequest.bank_info.bankName}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Số tài khoản:</span>
                                        <div className="flex items-center gap-1.5 font-mono font-bold text-foreground text-sm">
                                            <span>{createdRequest.bank_info.accountNumber}</span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(createdRequest.bank_info.accountNumber, "acc")}
                                                className="p-1 hover:bg-secondary rounded text-amber-600 dark:text-amber-400"
                                            >
                                                {copiedField === "acc" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Chủ tài khoản:</span>
                                        <span className="font-semibold text-foreground">{createdRequest.bank_info.accountName}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-border">
                                        <span className="text-muted-foreground">Số tiền:</span>
                                        <span className="font-bold text-base text-rose-600 dark:text-rose-400">
                                            {createdRequest.amount.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-1.5">
                                    <div className="text-xs text-amber-800 dark:text-amber-200 font-semibold uppercase tracking-wider">
                                        Nội dung chuyển khoản (bắt buộc):
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">
                                            {createdRequest.transfer_code}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(createdRequest.transfer_code, "code")}
                                            className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/30"
                                        >
                                            {copiedField === "code" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Bill Screen */}
                        <div className="space-y-4 pt-4 border-t border-border">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase">
                                Tải ảnh biên lai / bill chuyển khoản
                            </label>

                            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border hover:border-amber-500 p-6 text-sm text-muted-foreground hover:text-foreground transition-all">
                                <Upload className="h-6 w-6 text-amber-500" />
                                <span>{proofFile ? proofFile.name : "Kéo thả hoặc bấm để chọn ảnh bill chuyển khoản"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            {proofPreview && (
                                <div className="relative h-32 w-48 rounded-xl overflow-hidden border border-border shadow-md">
                                    <Image
                                        src={proofPreview}
                                        alt="Preview biên lai"
                                        fill
                                        sizes="192px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleUploadProof}
                                disabled={loading || !proofPreview}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-3.5 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Đang gửi xác nhận...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <span>Tôi đã chuyển khoản & Gửi biên lai</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="text-center py-8 space-y-5">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif font-bold text-foreground">
                                Gửi biên lai thanh toán thành công!
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                                AthenaStock đã tiếp nhận yêu cầu nâng cấp gói <strong className="text-foreground">{selectedPackage.name}</strong> của bạn với mã giao dịch <strong className="text-amber-600 dark:text-amber-400 font-mono">{createdRequest?.transfer_code}</strong>.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-secondary/20 p-4 max-w-md mx-auto text-xs text-muted-foreground text-left space-y-1.5">
                            <div>• Quản trị viên sẽ rà soát và kích hoạt trong vòng 15-30 phút.</div>
                            <div>• Thông báo kích hoạt VIP thành công sẽ hiển thị ngay trên trang cá nhân của bạn.</div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/profile"
                                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 transition-all"
                            >
                                Đi đến Trang cá nhân
                            </Link>
                            <Link
                                href="/business"
                                className="w-full sm:w-auto rounded-xl bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-all"
                            >
                                Đọc bài nghiên cứu
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
