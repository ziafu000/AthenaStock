import Link from "next/link"
import { ArrowLeft, Compass, Home } from "lucide-react"

export const metadata = {
    title: "404 – Lạc lối? | Đầu tư tỉnh thức",
    description: "Trang không tìm thấy. Hãy quay về vùng biên an toàn.",
}

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
            {/* Visual Icon */}
            <div className="relative mb-8 group">
                <div className="absolute -inset-4 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-all duration-700" />
                <Compass className="relative h-24 w-24 text-muted-foreground/50 rotate-45 group-hover:text-accent/80 group-hover:rotate-12 transition-all duration-700 ease-in-out" strokeWidth={1} />
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 font-serif text-6xl font-bold text-primary md:text-8xl tracking-tight">
                404
            </h1>

            {/* Subheading */}
            <h2 className="mb-6 text-2xl font-medium text-foreground md:text-3xl font-serif">
                Bạn đã đi lạc khỏi <span className="text-accent italic">biên an toàn</span>?
            </h2>

            {/* Description */}
            <p className="max-w-[500px] text-lg text-muted-foreground leading-relaxed mb-10">
                Thị trường biến động, và đôi khi các liên kết cũng vậy.
                Trang bạn đang tìm kiếm không tồn tại, hoặc đã được di dời đến một vị trí mới.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                    href="/"
                    className="flex h-12 items-center gap-2 rounded-lg border-2 border-primary bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                    <Home size={18} />
                    Về Trang chủ
                </Link>

                <Link
                    href="/articles"
                    className="flex h-12 items-center gap-2 rounded-lg border border-input bg-background px-8 text-sm font-medium text-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/40 transition-all hover:-translate-y-0.5"
                >
                    <ArrowLeft size={18} />
                    Đọc bài viết mới nhất
                </Link>
            </div>

            {/* Footer Quote */}
            <div className="mt-16 border-t pt-8 max-w-md">
                <p className="text-xs text-muted-foreground/70 font-serif italic">
                    "Rủi ro đến từ việc bạn không biết mình đang làm gì."
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wider">
                    — Warren Buffett
                </p>
            </div>
        </div>
    )
}
