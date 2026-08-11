export function escapeHtml(value: string | null | undefined) {
    return (value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

export function asHttpUrl(value: string | null | undefined) {
    if (!value) return null
    try {
        const url = new URL(value)
        return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
    } catch {
        return null
    }
}
