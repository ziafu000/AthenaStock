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
            "fixed bottom-8 right-8 z-40 flex flex-col gap-2 transition-all duration-300 print:hidden",
            isFocusMode ? "opacity-25 hover:opacity-100 scale-90 hover:scale-100" : "opacity-100"
        )}>
            <div className="flex flex-col items-center gap-2 rounded-full border border-border/60 bg-background/70 p-2 shadow-xl shadow-primary/5 backdrop-blur-md">
                <button
                    onClick={toggleFocusMode}
                    className="rounded-full p-2.5 hover:bg-accent/10 hover:text-accent active:scale-90 transition-all duration-300 ease-out-expo"
                    title="Toggle Focus Mode"
                >
                    {isFocusMode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <div className="h-px w-6 bg-border/60" />

                <button
                    onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
                    className="rounded-full p-2.5 hover:bg-accent/10 hover:text-accent active:scale-90 transition-all duration-300 ease-out-expo"
                    title="Toggle Font Size"
                >
                    {fontSize === "normal" ? <Type size={16} /> : <Type size={18} />}
                </button>

                <button
                    onClick={() => setLineWidth(lineWidth === "normal" ? "wide" : "normal")}
                    className="rounded-full p-2.5 hover:bg-accent/10 hover:text-accent active:scale-90 transition-all duration-300 ease-out-expo"
                    title="Toggle Line Width"
                >
                    <MoveHorizontal size={18} />
                </button>
            </div>
        </div>
    )
}
