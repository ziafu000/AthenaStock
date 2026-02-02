"use client"

import { useReading } from "@/components/reading/ReadingContext"
import { ReadingControls } from "@/components/reading/ReadingControls"
import { ReadingProgress } from "@/components/article/ReadingProgress"
import { cn } from "@/lib/utils"

interface BusinessAnalysisLayoutProps {
    children: React.ReactNode
    meta: any
}

export function BusinessAnalysisLayout({ children, meta }: BusinessAnalysisLayoutProps) {
    const { fontSize, lineWidth } = useReading()

    return (
        <>
            <ReadingProgress />
            <div className="relative flex min-h-screen justify-center">
                <div className={cn(
                    "relative flex w-full flex-col px-4 py-8 md:px-8 md:py-12 lg:py-16 transition-all duration-300",
                    lineWidth === "normal" ? "max-w-4xl" : "max-w-6xl"
                )}>
                    <div className="mb-8 border-b pb-8">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground mb-4">
                            <span className="uppercase tracking-widest text-xs font-bold text-accent">Business Analysis</span>
                            {meta.tickers && <span className="text-secondary-foreground/20">• {meta.tickers.join(", ")}</span>}
                            {meta.market && <span className="text-secondary-foreground/20">• {meta.market}</span>}
                        </div>

                        <h1 className="text-4xl font-serif font-bold tracking-tight md:text-6xl mb-6 text-primary leading-tight">
                            {meta.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-serif italic">
                            {meta.description}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-6 text-sm border-t pt-6 w-full">
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Analysis Date</span>
                                <time dateTime={meta.date} className="font-medium mt-1">
                                    {new Date(meta.date).toLocaleDateString("vi-VN")}
                                </time>
                            </div>
                            {meta.updatedAt && (
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Last Updated</span>
                                    <time dateTime={meta.updatedAt} className="font-medium mt-1">
                                        {new Date(meta.updatedAt).toLocaleDateString("vi-VN")}
                                    </time>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Risk Level</span>
                                <span className={cn(
                                    "font-bold px-2 py-0.5 rounded-sm inline-block w-fit text-xs mt-1 border",
                                    meta.riskLevel === "low" && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                                    meta.riskLevel === "medium" && "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                                    meta.riskLevel === "high" && "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                                )}>
                                    {meta.riskLevel?.toUpperCase() || "UNKNOWN"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "prose dark:prose-invert prose-stone max-w-none transition-all duration-300 font-serif leading-loose",
                            fontSize === "large" ? "prose-lg" : "prose-base",
                            "prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight",
                            "prose-img:rounded-lg prose-img:shadow-md prose-img:border"
                        )}
                    >
                        {children}
                    </div>

                    <div className="mt-16 border-t pt-8">
                        <h3 className="text-lg font-serif font-bold mb-4">Disclaimer & Sleep-well Test</h3>
                        <div className="bg-secondary/30 p-6 rounded-lg text-sm text-muted-foreground space-y-4 border border-secondary">
                            <p>
                                <strong className="text-primary">Disclaimer:</strong> Bài viết này chỉ mang tính chất phân tích giáo dục, giúp hiểu rõ bản chất doanh nghiệp.
                                Đây KHÔNG phải là lời khuyên mua/bán cổ phiếu. Tác giả có thể nắm giữ vị thế trong doanh nghiệp được nhắc đến.
                            </p>
                            <p>
                                <strong className="text-primary">Sleep-well Test:</strong> Nếu thị trường đóng cửa 5 năm, bạn có lo lắng khi nắm giữ doanh nghiệp này không?
                                Nếu câu trả lời là "Có", hãy cân nhắc lại margin of safety của bạn.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ReadingControls />
        </>
    )
}
