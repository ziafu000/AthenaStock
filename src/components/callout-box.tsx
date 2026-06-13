import { cn } from "@/lib/utils"
import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react"

interface CalloutProps {
    icon?: string
    title?: string
    children?: React.ReactNode
    type?: "default" | "warning" | "danger" | "info"
}

export function Callout({
    children,
    icon,
    title,
    type = "default",
    ...props
}: CalloutProps) {
    return (
        <div
            className={cn("my-6 flex items-start rounded-2xl border border-l-4 p-5 backdrop-blur-sm shadow-sm transition-all font-sans", {
                "border-stone-200 bg-stone-50/80 dark:border-stone-800/50 dark:bg-white/[0.01] border-l-stone-400 dark:border-l-stone-600 text-foreground": type === "default",
                "border-amber-200 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-950/5 border-l-amber-500 text-amber-900 dark:text-amber-300": type === "warning",
                "border-red-200 bg-red-50/50 dark:border-red-900/20 dark:bg-red-950/5 border-l-red-500 text-red-900 dark:text-red-300": type === "danger",
                "border-[#e61c5c]/20 bg-[#e61c5c]/[0.02] dark:border-[#e61c5c]/10 dark:bg-[#e61c5c]/[0.01] border-l-[#e61c5c] text-foreground": type === "info",
            })}
            {...props}
        >
            {icon && <span className="mr-4 text-2xl shrink-0">{icon}</span>}
            {!icon && type === "warning" && <AlertTriangle className="mr-4 h-5 w-5 text-amber-500 shrink-0" />}
            {!icon && type === "danger" && <ShieldAlert className="mr-4 h-5 w-5 text-red-500 shrink-0" />}
            {!icon && type === "info" && <Info className="mr-4 h-5 w-5 text-[#e61c5c] shrink-0" />}
            {!icon && type === "default" && <Lightbulb className="mr-4 h-5 w-5 text-stone-500 dark:text-stone-400 shrink-0" />}

            <div className="flex-1">
                {title && <p className="font-bold mb-1 text-foreground">{title}</p>}
                <div className="text-sm [&>p]:leading-relaxed">{children}</div>
            </div>
        </div>
    )
}
