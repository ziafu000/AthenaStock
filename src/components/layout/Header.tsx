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
            "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300",
            isFocusMode ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        )}>
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <Image
                            src="/logo.png"
                            alt="Athena Stock"
                            width={48}
                            height={48}
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                        <div className="hidden sm:flex flex-col">
                            <span className="font-serif font-bold text-lg tracking-tight text-primary group-hover:text-accent transition-colors leading-tight">
                                Athena Stock
                            </span>
                            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                                Đầu tư tỉnh thức
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "transition-colors hover:text-accent relative py-1",
                                pathname.startsWith(link.href)
                                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-accent"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    <button className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <div className="h-6 w-px bg-border hidden sm:block"></div>

                    <ModeToggle />

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 hover:bg-accent/10 rounded-md"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t bg-background absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
                    <nav className="container py-6 flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-base font-medium transition-colors hover:text-accent px-4 py-2 rounded-md hover:bg-accent/5",
                                    pathname.startsWith(link.href) ? "text-accent bg-accent/5" : "text-foreground"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
