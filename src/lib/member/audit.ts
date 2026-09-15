import { getDatabase } from "@/lib/booking/db"

interface RecordAuditLogParams {
    actorType: "admin" | "member" | "system"
    actorId: string
    action: string
    targetType: string
    targetId: string
    details?: Record<string, unknown>
}

export async function recordAuditLog({
    actorType,
    actorId,
    action,
    targetType,
    targetId,
    details = {},
}: RecordAuditLogParams): Promise<void> {
    try {
        const sql = getDatabase()
        await sql`
            INSERT INTO public.membership_audit_logs (
                actor_type, actor_id, action, target_type, target_id, details
            ) VALUES (
                ${actorType}, ${actorId}, ${action}, ${targetType}, ${targetId}, ${JSON.stringify(details)}::jsonb
            )
        `
    } catch (error) {
        console.error("Failed to record membership audit log:", error)
    }
}
