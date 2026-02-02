import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="border-t bg-background/50 print:hidden mt-auto">
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
                                className="h-10 w-auto"
                            />
                            <div>
                                <h3 className="font-serif font-bold text-lg text-primary">Athena Stock</h3>
                                <p className="text-xs text-muted-foreground">Đầu tư tỉnh thức</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Đọc chậm. Suy ngẫm kỹ. Giao dịch ít. Ngủ ngon. <br />
                            Ngủ ngon với tiền của bạn.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Khám phá</h4>
                        <nav className="flex flex-col space-y-3 text-sm">
                            <Link href="/about" className="hover:text-accent transition-colors font-medium">
                                Về chúng tôi & Triết lý
                            </Link>
                            <Link href="/advisory" className="hover:text-accent transition-colors font-medium">
                                Tư vấn & Đồng hành
                            </Link>
                            <Link href="/business" className="hover:text-accent transition-colors font-medium">
                                Phân tích doanh nghiệp
                            </Link>
                            <Link href="/psychology" className="hover:text-accent transition-colors font-medium">
                                Tâm lý & Hành vi
                            </Link>
                            <Link href="/frameworks" className="hover:text-accent transition-colors font-medium">
                                Các Framework
                            </Link>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Thông tin</h4>
                        <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
                            <Link href="/about" className="hover:text-foreground transition-colors">
                                Về chúng tôi
                            </Link>
                            <Link href="/disclaimer" className="hover:text-foreground transition-colors">
                                Miễn trừ trách nhiệm
                            </Link>
                            <a href="mailto:contact@athenastock.vn" className="hover:text-foreground transition-colors">
                                Liên hệ
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
                    <p>
                        © {new Date().getFullYear()} Athena Stock. All rights reserved.
                    </p>
                    <p className="opacity-70">
                        Nội dung chỉ mang tính chất chia sẻ cá nhân, không phải khuyến nghị đầu tư.
                    </p>
                </div>
            </div>
        </footer>
    )
}
