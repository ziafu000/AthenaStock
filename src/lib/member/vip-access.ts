export interface VipAccessCheckResult {
    isLocked: boolean
    isVipWindow: boolean
    unlockAt: string
    remainingMs: number
    isGlobalOverride: boolean
}

export function checkResearchVipAccess({
    publishedAt,
    date,
    isVip = false,
    isAdmin = false,
}: {
    publishedAt?: string
    date: string
    isVip?: boolean
    isAdmin?: boolean
}): VipAccessCheckResult {
    const isGlobalOverride =
        process.env.GLOBAL_VIP_OVERRIDE === "true"
        || process.env.NEXT_PUBLIC_GLOBAL_VIP_OVERRIDE === "true"

    const baseDateStr = publishedAt || date
    const publishDate = new Date(baseDateStr)
    const pubTime = isNaN(publishDate.getTime()) ? Date.now() : publishDate.getTime()

    // 8 hours VIP-first window
    const unlockTime = pubTime + 8 * 60 * 60 * 1000
    const now = Date.now()
    const remainingMs = Math.max(0, unlockTime - now)
    const isVipWindow = remainingMs > 0

    const isLocked = !isGlobalOverride && !isAdmin && !isVip && isVipWindow

    return {
        isLocked,
        isVipWindow,
        unlockAt: new Date(unlockTime).toISOString(),
        remainingMs,
        isGlobalOverride,
    }
}
