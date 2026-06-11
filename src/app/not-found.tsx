import Link from "next/link"
import { ArrowLeft, Compass, Home } from "lucide-react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export const metadata = {
    title: "404 – Lạc lối? | Đầu tư tỉnh thức",
    description: "Trang không tìm thấy. Hãy quay về vùng biên an toàn.",
}

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
            {/* Visual Icon */}
            <ScrollReveal duration={1000} direction="down">
                <div className="relative mb-8 group inline-block">
                    <div className="absolute -inset-6 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-700 pointer-events-none" />
                    <Compass className="relative h-24 w-24 text-muted-foreground/45 rotate-45 group-hover:text-accent/80 group-hover:rotate-12 transition-all duration-700 ease-out-expo" strokeWidth={1} />
                </div>
            </ScrollReveal>

            {/* Main Heading */}
            <ScrollReveal delay={200} duration={800}>
                <h1 className="mb-4 font-serif text-6xl font-bold text-primary md:text-8xl tracking-tight leading-none">
                    404
                </h1>
            </ScrollReveal>

            {/* Subheading */}
            <ScrollReveal delay={350} duration={800}>
                <h2 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl font-serif">
                    Bạn đã đi lạc khỏi <span className="text-accent italic">biên an toàn</span>?
                </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={500} duration={800}>
                <p className="max-w-[500px] text-base text-muted-foreground leading-relaxed mb-10 font-sans">
                    Thị trường biến động, và đôi khi các liên kết cũng vậy.<br />
                    Trang bạn đang tìm kiếm không tồn tại, hoặc đã được di dời đến một vị trí mới.
                </p>
            </ScrollReveal>

            {/* Actions */}
            <ScrollReveal delay={650} duration={800}>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto h-12 px-8 rounded-lg border border-primary bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10 active:scale-[0.97]"
                    >
                        <Home size={16} />
                        Về Trang chủ
                    </Link>

                    <Link
                        href="/articles"
                        className="w-full sm:w-auto h-12 px-8 rounded-lg border border-border bg-background/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                    >
                        <ArrowLeft size={16} />
                        Đọc bài viết mới nhất
                    </Link>
                </div>
            </ScrollReveal>

            {/* Footer Quote */}
            <ScrollReveal delay={800} duration={1000}>
                <div className="mt-16 border-t border-border/60 pt-8 max-w-md mx-auto">
                    <p className="text-xs text-muted-foreground/70 font-serif italic">
                        &quot;Rủi ro đến từ việc bạn không biết mình đang làm gì.&quot;
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-wider font-semibold font-sans">
                        — Warren Buffett
                    </p>
                </div>
            </ScrollReveal>
        </div>
    )
}
