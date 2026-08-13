import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-gradient-to-b from-transparent to-secondary/15 print:hidden mt-auto">
            <div className="container py-12 md:py-16">
                <div className="grid gap-12 md:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Athena Stock"
                                width={40}
                                height={40}
                                className="h-10 w-auto hover:scale-105 transition-transform duration-300"
                            />
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary">Athena Stock</h3>
                                <p className="text-xs text-muted-foreground font-sans">Đầu tư như một người chủ doanh nghiệp</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-sans">
                            Đọc chậm. Suy ngẫm kỹ. Giao dịch ít. Ngủ ngon.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4 font-sans">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Khám phá</h4>
                        <nav className="flex flex-col space-y-3 text-sm">
                            <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors duration-300 font-medium">
                                Về chúng tôi & Triết lý
                            </Link>
                            <Link href="/advisory" className="text-muted-foreground hover:text-accent transition-colors duration-300 font-medium">
                                Tư vấn & Đồng hành
                            </Link>
                            <Link href="/business" className="text-muted-foreground hover:text-accent transition-colors duration-300 font-medium">
                                Phân tích doanh nghiệp
                            </Link>
                            <Link href="/psychology" className="text-muted-foreground hover:text-accent transition-colors duration-300 font-medium">
                                Tâm lý & Hành vi
                            </Link>
                            <Link href="/frameworks" className="text-muted-foreground hover:text-accent transition-colors duration-300 font-medium">
                                Các Framework
                            </Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4 font-sans">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Thông tin</h4>
                        <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
                            <Link href="/about" className="hover:text-foreground transition-colors duration-300">
                                Về chúng tôi
                            </Link>
                            <Link href="/disclaimer" className="hover:text-foreground transition-colors duration-300">
                                Miễn trừ trách nhiệm
                            </Link>
                            <a href="mailto:contact@athenastock.com" className="hover:text-foreground transition-colors duration-300">
                                Liên hệ
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4 font-sans">
                    <p>
                        © {new Date().getFullYear()} Athena Stock. All rights reserved. <span className="mx-1.5 opacity-40">•</span> Developed by Aaron Nguyen.
                    </p>
                    <p className="opacity-70 text-center md:text-right">
                        Nội dung chỉ mang tính chất chia sẻ cá nhân, không phải khuyến nghị đầu tư.
                    </p>
                </div>
            </div>
        </footer>
    )
}
