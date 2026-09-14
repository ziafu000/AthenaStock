export type MemberTier = "normal" | "vip"

export interface Member {
    id: string
    email: string
    full_name: string
    phone: string | null
    tier: MemberTier
    vip_started_at: string | null
    vip_expires_at: string | null
    created_at: string
    updated_at: string
}

export interface VipPackage {
    id: string
    months: number
    name: string
    amount: number
    discountBadge?: string
    popular?: boolean
    description: string
}

export const VIP_PACKAGES: VipPackage[] = [
    {
        id: "vip_1m",
        months: 1,
        name: "1 Tháng",
        amount: 299000,
        description: "Trải nghiệm đầy đủ quyền lợi VIP trong 30 ngày",
    },
    {
        id: "vip_3m",
        months: 3,
        name: "3 Tháng",
        amount: 799000,
        discountBadge: "Tiết kiệm 11%",
        popular: true,
        description: "Lựa chọn phổ biến nhất cho nhà đầu tư chủ động",
    },
    {
        id: "vip_6m",
        months: 6,
        name: "6 Tháng",
        amount: 1499000,
        discountBadge: "Tiết kiệm 17%",
        description: "Đồng hành theo chu kỳ 2 quý báo cáo tài chính",
    },
    {
        id: "vip_12m",
        months: 12,
        name: "12 Tháng",
        amount: 2699000,
        discountBadge: "Tiết kiệm 25%",
        description: "Tiết kiệm tối đa, trọn vẹn chu kỳ cả năm tài chính",
    },
]

export const BANK_CONFIG = {
    bankName: process.env.VIP_BANK_NAME || "MB Bank",
    bankId: process.env.VIP_BANK_ID || "MB",
    accountNumber: process.env.VIP_BANK_ACCOUNT_NUMBER || "0901234567",
    accountName: process.env.VIP_BANK_ACCOUNT_NAME || "ATHENA STOCK",
}

export type VipPaymentRequestStatus = "pending" | "approved" | "rejected" | "more_info_needed"

export interface VipPaymentRequest {
    id: string
    member_id: string
    package_id: string
    package_months: number
    amount: number
    transfer_code: string
    bank_info: {
        bankName: string
        bankId?: string
        accountNumber: string
        accountName: string
    }
    status: VipPaymentRequestStatus
    proof_image_data?: string | null
    has_proof?: boolean
    upload_token?: string
    notes: string | null
    created_at: string
    approved_at: string | null
    updated_at: string
    member_name?: string
    member_email?: string
    member_phone?: string | null
}

export const WATCHLIST_STATUSES = [
    "Đang theo dõi",
    "Chờ thêm dữ liệu",
    "Đang cập nhật",
    "Đã hoàn tất nghiên cứu",
    "Tạm dừng theo dõi",
] as const

export type WatchlistStatus = (typeof WATCHLIST_STATUSES)[number]

export interface WatchlistItem {
    id: string
    member_id: string
    ticker: string
    status: WatchlistStatus
    notes: string | null
    created_at: string
    updated_at: string
}

export interface PortfolioHolding {
    id: string
    member_id: string
    ticker: string
    shares: number
    cost_basis: number
    notes: string | null
    created_at: string
    updated_at: string
}

export interface PortfolioHoldingWithMetrics extends PortfolioHolding {
    market_price: number
    total_cost: number
    market_value: number
    gain_loss: number
    gain_loss_percent: number
    weight: number
}

export interface PortfolioSummary {
    total_cost: number
    total_market_value: number
    total_gain_loss: number
    total_gain_loss_percent: number
    holdings: PortfolioHoldingWithMetrics[]
}

export interface MembershipAuditLog {
    id: string
    actor_type: "admin" | "member" | "system"
    actor_id: string
    action: string
    target_type: string
    target_id: string
    details: Record<string, unknown>
    created_at: string
}

export interface MemberSession {
    memberId: string
    email: string
    tier: MemberTier
    vipExpiresAt?: string | null
}
