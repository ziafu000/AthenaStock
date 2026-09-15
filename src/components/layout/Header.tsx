"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/ui/ModeToggle"
import { useReading } from "@/components/reading/ReadingContext"
import { cn } from "@/lib/utils"
import { Menu, X, Crown, User } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { SearchBubble } from "@/components/layout/SearchBubble"

const navLinks = [
    { href: "/about", label: "Về chúng tôi" },
    { href: "/advisory", label: "Tư vấn & Đồng hành" },
    { href: "/articles", label: "Bài viết" },
    { href: "/business", label: "Doanh nghiệp" },
    { href: "/psychology", label: "Tâm lý" },
    { href: "/frameworks", label: "Frameworks" },
]

export function Header() {
    const { isFocusMode } = useReading()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 w-full flex justify-center bg-transparent px-4 py-3 transition-all duration-300",
            isFocusMode ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        )}>
            {/* Desktop Layout: Three separate sections */}
            <div className="hidden lg:flex w-full max-w-7xl items-center justify-between px-6">
                {/* Left: Brand Logo & Title (no background) */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={32}
                            height={32}
                            className="h-8 w-auto transition-transform group-hover:scale-105"
                            priority
                        />
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-base tracking-tight text-primary leading-tight">
                                Athena Stock
                            </span>
                            <span className="text-[8px] text-muted-foreground tracking-wider uppercase font-sans">
                                Investment Thinking House
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center: Floating Navigation Capsule/Pill */}
                <div className="h-14 rounded-full border border-border/40 bg-background/70 backdrop-blur-md shadow-md hover:shadow-lg transition-all flex items-center justify-between px-6 space-x-6">
                    <nav className="flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-all duration-300 rounded-full px-3.5 py-1.5 hover:bg-secondary/40 font-serif font-bold text-xs md:text-sm",
                                    pathname.startsWith(link.href)
                                        ? "text-[#e61c5c] bg-[#e61c5c]/5"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions (no background) */}
                <div className="flex items-center space-x-2.5">
                    <Link
                        href="/vip/upgrade"
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:from-amber-500/25 hover:to-rose-500/25 transition-all"
                    >
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                        <span>VIP</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="rounded-full p-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                        title="Trang cá nhân & Danh mục"
                    >
                        <User className="h-4 w-4" />
                    </Link>

                    <div className="h-4 w-px bg-border"></div>

                    <SearchBubble />

                    <div className="h-4 w-px bg-border"></div>

                    <ModeToggle />
                </div>
            </div>

            {/* Mobile Layout: Unified Floating Capsule */}
            <div className="lg:hidden w-full max-w-5xl h-14 rounded-full border border-border/40 bg-background/70 backdrop-blur-md shadow-md flex items-center justify-between px-4 relative">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={28}
                            height={28}
                            className="h-7 w-auto"
                            priority
                        />
                        <span className="font-serif font-bold text-sm text-primary leading-tight">
                            Athena Stock
                        </span>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5">
                    <Link
                        href="/vip/upgrade"
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300"
                    >
                        <Crown className="h-3 w-3 text-amber-500" />
                        <span>VIP</span>
                    </Link>

                    <SearchBubble />

                    <ModeToggle />

                    <button
                        className="p-1.5 hover:bg-secondary/50 rounded-full transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Nav Dropdown */}
                {mobileMenuOpen && (
                    <div className="absolute top-[4.5rem] left-0 right-0 border border-border/40 bg-background/95 backdrop-blur-md rounded-3xl p-4 shadow-xl flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm transition-all px-4 py-2.5 rounded-xl font-serif font-bold",
                                        pathname.startsWith(link.href)
                                            ? "text-[#e61c5c] bg-[#e61c5c]/5"
                                            : "text-foreground hover:bg-secondary/35"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-border/40 flex flex-col space-y-1">
                                <Link
                                    href="/vip/upgrade"
                                    className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-serif font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Crown className="h-4 w-4" />
                                    <span>Nâng cấp Hội viên VIP</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-serif font-bold text-foreground hover:bg-secondary/35"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Trang cá nhân & Watchlist</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
