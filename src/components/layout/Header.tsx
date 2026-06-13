"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/ui/ModeToggle"
import { useReading } from "@/components/reading/ReadingContext"
import { cn } from "@/lib/utils"
import { Menu, X, Search } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

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
            <div className="w-full max-w-5xl h-14 rounded-full border border-border/40 bg-background/70 backdrop-blur-md shadow-md hover:shadow-lg transition-all flex items-center justify-between px-4 md:px-6 relative">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={32}
                            height={32}
                            className="h-8 w-auto transition-transform group-hover:scale-105"
                            priority
                        />
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-sm md:text-base tracking-tight text-primary leading-tight">
                                Athena Stock
                            </span>
                            <span className="text-[8px] text-muted-foreground tracking-wider uppercase font-sans hidden sm:inline">
                                Đầu tư tỉnh thức
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1">
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

                {/* Right side */}
                <div className="flex items-center space-x-2.5">
                    <Link
                        href="/search"
                        aria-label="Tìm kiếm"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-full transition-all"
                    >
                        <Search size={18} strokeWidth={1.5} />
                    </Link>

                    <div className="h-4 w-px bg-border hidden sm:block"></div>

                    <ModeToggle />

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 hover:bg-secondary/50 rounded-full transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Nav Card Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-[4.5rem] left-0 right-0 border border-border/40 bg-background/95 backdrop-blur-md rounded-3xl p-4 shadow-xl flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
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
                            <Link
                                href="/search"
                                className={cn(
                                    "text-sm transition-all px-4 py-2.5 rounded-xl font-serif font-bold flex items-center gap-2",
                                    pathname.startsWith("/search")
                                        ? "text-[#e61c5c] bg-[#e61c5c]/5"
                                        : "text-foreground hover:bg-secondary/35"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Search size={16} />
                                Tìm kiếm
                            </Link>
                            <Link
                                href="/advisory"
                                className="mt-2 text-sm font-serif font-bold text-center text-white bg-[#090d16] dark:text-[#090d16] dark:bg-[#faf8f6] py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tư vấn & Đồng hành
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
