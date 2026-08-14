"use client"

import { useState, useEffect } from "react"
import { Briefcase, X, ExternalLink, Loader2 } from "lucide-react"
import { useReading } from "@/components/reading/ReadingContext"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function RecruitmentBubble() {
    const { isFocusMode } = useReading()
    const [isOpen, setIsOpen] = useState(false)
    const [iframeLoading, setIframeLoading] = useState(true)

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown)
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden"
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <>
            {/* Floating Bubble */}
            <div
                className={cn(
                    "fixed bottom-8 left-8 z-40 transition-all duration-300 print:hidden",
                    isFocusMode ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
                )}
            >
                <button
                    onClick={() => {
                        setIsOpen(true)
                        setIframeLoading(true)
                    }}
                    className="group relative flex h-12 items-center justify-center gap-2 rounded-full border bg-background/85 px-3 py-2 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-background hover:shadow-accent/5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 md:px-4"
                    title="Cơ hội cộng tác"
                    aria-label="Mở form tìm hiểu cơ hội cộng tác"
                >
                    <div className="relative flex h-5 w-5 items-center justify-center">
                        <Briefcase size={20} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="max-w-0 overflow-hidden text-sm font-semibold text-foreground transition-all duration-300 group-hover:max-w-xs md:max-w-xs md:group-hover:max-w-xs whitespace-nowrap">
                        Cộng tác
                    </span>

                    {/* "Mới" Badge with gradient, shadow and pulse animation */}
                    <span className="absolute -top-2 -right-2 flex h-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-2 text-[9px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/25 ring-2 ring-background select-none">
                        <span className="absolute -inset-0.5 -z-10 animate-pulse rounded-full bg-orange-500/60 blur-[2px]"></span>
                        Mới
                    </span>
                </button>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <div 
                        className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="recruitment-modal-title"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-accent/10 p-2 text-accent">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h2 id="recruitment-modal-title" className="font-serif font-bold text-lg text-primary md:text-xl">
                                        Cơ hội cộng tác
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Tìm hiểu mức độ phù hợp để cùng xây dựng Athena Stock
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Thông tin được gửi qua Google Forms và chỉ dùng để đánh giá mức độ phù hợp cho cơ hội cộng tác.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <a
                                    href={siteConfig.recruitmentFormUrl.replace("?embedded=true", "")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                                    title="Mở form trong tab mới"
                                >
                                    <span className="hidden sm:inline">Mở trong tab mới</span>
                                    <ExternalLink size={14} />
                                </a>
                                
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-full p-1.5 text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                                    aria-label="Đóng cửa sổ"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body (Iframe) */}
                        <div className="relative flex-1 bg-muted/5">
                            {iframeLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 z-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                                    <p className="text-sm text-muted-foreground">Đang tải form cộng tác...</p>
                                </div>
                            )}
                            
                            <iframe
                                src={siteConfig.recruitmentFormUrl}
                                className="h-full w-full border-0"
                                title="Google Form cơ hội cộng tác"
                                onLoad={() => setIframeLoading(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
