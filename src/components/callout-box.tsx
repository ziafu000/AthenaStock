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
            className={cn("my-6 flex items-start rounded-md border border-l-4 p-4", {
                "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900": type === "default",
                "border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200": type === "warning",
                "border-red-500/50 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200": type === "danger",
                "border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200": type === "info",
            })}
            {...props}
        >
            {icon && <span className="mr-4 text-2xl">{icon}</span>}
            {!icon && type === "warning" && <AlertTriangle className="mr-4 h-5 w-5" />}
            {!icon && type === "danger" && <ShieldAlert className="mr-4 h-5 w-5" />}
            {!icon && type === "info" && <Info className="mr-4 h-5 w-5" />}
            {!icon && type === "default" && <Lightbulb className="mr-4 h-5 w-5" />}

            <div>
                {title && <p className="font-semibold mb-1">{title}</p>}
                <div className="text-sm [&>p]:leading-relaxed">{children}</div>
            </div>
        </div>
    )
}
