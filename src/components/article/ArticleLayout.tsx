"use client"

import { useReading } from "@/components/reading/ReadingContext"
import { ReadingControls } from "@/components/reading/ReadingControls"
import { ReadingProgress } from "@/components/article/ReadingProgress"
import { cn } from "@/lib/utils"

interface ArticleLayoutProps {
    children: React.ReactNode
    meta?: {
        title: string
        date: string
        readingTime?: string
    }
}

export function ArticleLayout({ children, meta }: ArticleLayoutProps) {
    const { fontSize, lineWidth } = useReading()

    return (
        <>
            <ReadingProgress />
            <div className={cn("relative flex min-h-screen justify-center transition-colors duration-500")}>
                <div className={cn(
                    "relative flex w-full flex-col px-6 py-12 transition-all duration-500 md:px-8 md:py-16 lg:py-20",
                    lineWidth === "normal" ? "max-w-3xl" : "max-w-4xl"
                )}>
                    {meta && (
                        <div className="mb-12 space-y-6 text-center border-b border-border/60 pb-12">
                            <h1 className="text-3xl font-serif font-bold tracking-tight md:text-4xl lg:text-5xl leading-[1.2] text-primary">
                                {meta.title}
                            </h1>
                            <div className="flex items-center justify-center space-x-4 text-xs tracking-wider uppercase text-muted-foreground font-semibold font-sans">
                                <time dateTime={meta.date}>
                                    {new Date(meta.date).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                                {meta.readingTime && (
                                    <>
                                        <span className="text-secondary-foreground/20">•</span>
                                        <span>{meta.readingTime} read</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            "prose dark:prose-invert prose-stone mx-auto w-full transition-all duration-300 font-serif leading-loose",
                            fontSize === "large" ? "prose-lg" : "prose-base",
                            // Custom typography overrides for premium feel
                            "prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight",
                            "prose-a:text-accent prose-a:no-underline hover:prose-a:underline transition-all duration-300",
                            "prose-blockquote:border-l-accent prose-blockquote:bg-accent/[0.03] prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:pl-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-primary/90"
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
            <ReadingControls />
        </>
    )
}
