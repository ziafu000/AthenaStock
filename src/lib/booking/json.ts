export function parseJsonObject(value: unknown): Record<string, unknown> {
    const parsed = parseJson(value)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {}
}

export function parseJsonArray<T>(value: unknown): T[] {
    const parsed = parseJson(value)
    return Array.isArray(parsed) ? parsed as T[] : []
}

function parseJson(value: unknown): unknown {
    if (typeof value !== "string") return value
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}
