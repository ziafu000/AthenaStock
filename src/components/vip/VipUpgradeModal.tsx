"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Check, Copy, Upload, ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react"
import { VIP_PACKAGES } from "@/lib/member/types"
import type { VipPackage, VipPaymentRequest } from "@/lib/member/types"

interface VipUpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    initialPackageId?: string
}

export function VipUpgradeModal({ isOpen, onClose, initialPackageId = "vip_3m" }: VipUpgradeModalProps) {
    const [selectedPackage, setSelectedPackage] = useState<VipPackage>(
        VIP_PACKAGES.find((p) => p.id === initialPackageId) || VIP_PACKAGES[1]
    )
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

    // Check if user is already logged in
    useEffect(() => {
        if (!isOpen) return
        async function fetchMember() {
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
        void fetchMember()
    }, [isOpen])

    if (!isOpen) return null

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
                throw new Error(data.error || "Không thể tạo yêu cầu nâng cấp.")
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-background p-6 md:p-8 shadow-2xl my-8 transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                    aria-label="Đóng"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-6 space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span>NÂNG CẤP HỘI VIÊN ATHENA VIP</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                        {step === 1 && "Chọn gói hội viên phù hợp"}
                        {step === 2 && "Chuyển khoản & Xác nhận"}
                        {step === 3 && "Yêu cầu đã được ghi nhận!"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {step === 1 && "Đặc quyền đọc báo cáo VIP-first 8h và sử dụng Portfolio cá nhân."}
                        {step === 2 && "Quét mã VietQR hoặc chuyển khoản với nội dung chuyển khoản bên dưới."}
                        {step === 3 && "AthenaStock sẽ kiểm tra và kích hoạt tài khoản trong vòng 15-30 phút."}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* STEP 1: Choose Package & Member Details */}
                {step === 1 && (
                    <form onSubmit={handleCreateRequest} className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            {VIP_PACKAGES.map((pkg) => {
                                const isSelected = selectedPackage.id === pkg.id
                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`relative cursor-pointer rounded-xl border p-3.5 transition-all ${
                                            isSelected
                                                ? "border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500"
                                                : "border-border hover:border-stone-400 bg-secondary/20"
                                        }`}
                                    >
                                        {pkg.discountBadge && (
                                            <span className="absolute -top-2.5 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                                {pkg.discountBadge}
                                            </span>
                                        )}
                                        <div className="font-serif font-bold text-sm text-foreground">{pkg.name}</div>
                                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
                                            {pkg.amount.toLocaleString("vi-VN")} đ
                                        </div>
                                        <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                                            {pkg.description}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border">
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
                                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        Email nhận thông báo *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all"
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

                {/* STEP 2: Payment Screen with VietQR & Transfer Code */}
                {step === 2 && createdRequest && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            {/* VietQR code */}
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-4 shadow-sm">
                                {createdRequest.qr_code_url ? (
                                    <div className="relative h-56 w-56">
                                        <Image
                                            src={createdRequest.qr_code_url}
                                            alt="Mã QR thanh toán VietQR"
                                            fill
                                            sizes="224px"
                                            className="object-contain"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="h-56 w-56 flex items-center justify-center text-muted-foreground text-xs">
                                        Không tìm thấy ảnh QR
                                    </div>
                                )}
                                <span className="text-[11px] text-stone-500 mt-2 font-mono">Quét mã bằng app ngân hàng</span>
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-2.5 text-xs">
                                <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Ngân hàng:</span>
                                        <span className="font-semibold text-foreground">{createdRequest.bank_info.bankName}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Số tài khoản:</span>
                                        <div className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                                            <span>{createdRequest.bank_info.accountNumber}</span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(createdRequest.bank_info.accountNumber, "acc")}
                                                className="p-1 hover:bg-secondary rounded text-amber-600 dark:text-amber-400"
                                            >
                                                {copiedField === "acc" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Chủ tài khoản:</span>
                                        <span className="font-semibold text-foreground">{createdRequest.bank_info.accountName}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Số tiền:</span>
                                        <span className="font-bold text-sm text-rose-600 dark:text-rose-400">
                                            {createdRequest.amount.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                                    <div className="text-[11px] text-amber-800 dark:text-amber-200 font-semibold uppercase tracking-wider">
                                        Nội dung chuyển khoản (bắt buộc):
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">
                                            {createdRequest.transfer_code}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(createdRequest.transfer_code, "code")}
                                            className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/30"
                                        >
                                            {copiedField === "code" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                            <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Proof */}
                        <div className="space-y-3 pt-3 border-t border-border">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase">
                                Tải lên ảnh chụp màn hình chuyển khoản (Biên lai/Bill)
                            </label>

                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-amber-500 p-3 text-xs text-muted-foreground hover:text-foreground transition-all">
                                    <Upload className="h-4 w-4 text-amber-500" />
                                    <span>{proofFile ? proofFile.name : "Chọn file ảnh biên lai..."}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {proofPreview && (
                                <div className="relative h-24 w-36 rounded-lg overflow-hidden border border-border shadow-sm">
                                    <Image
                                        src={proofPreview}
                                        alt="Preview biên lai"
                                        fill
                                        sizes="144px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleUploadProof}
                                    disabled={loading || !proofPreview}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-rose-700 disabled:opacity-50 transition-all"
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
                    </div>
                )}

                {/* STEP 3: Success Confirmation */}
                {step === 3 && (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            <ShieldCheck className="h-8 w-8" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-serif font-bold text-foreground">
                                Gửi bằng chứng thanh toán thành công!
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Cảm ơn bạn đã nâng cấp hội viên VIP AthenaStock. Đội ngũ quản trị viên sẽ đối chiếu mã giao dịch <strong className="text-foreground">{createdRequest?.transfer_code}</strong> và kích hoạt hạng VIP cho bạn trong thời gian sớm nhất.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onClose}
                                className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-all"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
