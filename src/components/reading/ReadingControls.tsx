"use client"

import { useReading } from "@/components/reading/ReadingContext"
import { Eye, EyeOff, MoveHorizontal, Type } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReadingControls() {
    const {
        fontSize,
        setFontSize,
        lineWidth,
        setLineWidth,
        isFocusMode,
        toggleFocusMode,
    } = useReading()

    return (
        <div className={cn(
            "fixed bottom-8 right-8 z-40 flex flex-col gap-2 transition-opacity duration-300 print:hidden",
            isFocusMode ? "opacity-20 hover:opacity-100" : "opacity-100"
        )}>
            <div className="flex flex-col items-center gap-2 rounded-full border bg-background/80 p-2 shadow-sm backdrop-blur">
                <button
                    onClick={toggleFocusMode}
                    className="rounded-full p-2 hover:bg-accent/10 hover:text-accent transition-colors"
                    title="Toggle Focus Mode"
                >
                    {isFocusMode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                <div className="h-px w-full bg-border" />

                <button
                    onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
                    className="rounded-full p-2 hover:bg-accent/10 hover:text-accent transition-colors"
                    title="Toggle Font Size"
                >
                    {fontSize === "normal" ? <Type size={16} /> : <Type size={20} />}
                </button>

                <button
                    onClick={() => setLineWidth(lineWidth === "normal" ? "wide" : "normal")}
                    className="rounded-full p-2 hover:bg-accent/10 hover:text-accent transition-colors"
                    title="Toggle Line Width"
                >
                    <MoveHorizontal size={20} />
                </button>
            </div>
        </div>
    )
}
