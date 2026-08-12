"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { getPostUrl, getTypeLabel, Post } from "@/lib/content-types"

const suggestions = ["FPT", "biên an toàn", "tâm lý", "checklist", "định giá"]

export function SearchBubble() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Handle clicks outside to close/collapse search bubble
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsExpanded(false)
                setQuery("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Handle ESC key to collapse
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsExpanded(false)
                setQuery("")
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Fetch search results with debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        const debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data)
                }
            } catch (error) {
                console.error("Search fetch error:", error)
            } finally {
                setIsLoading(false)
            }
        }, 150)

        return () => clearTimeout(debounceTimer)
    }, [query])

    const handleSearchClick = () => {
        if (!isExpanded) {
            setIsExpanded(true)
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setIsExpanded(false)
            setQuery("")
        }
    }

    return (
        <div ref={containerRef} className="relative z-50">
            {/* Custom scoped styles for the morphing search bubble */}
            <style jsx>{`
                .sb-container {
                    position: relative;
                    width: 38px;
                    height: 38px;
                    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .sb-container.expanded {
                    width: 260px;
                }
                @media (max-width: 640px) {
                    .sb-container.expanded {
                        width: 200px;
                    }
                }
                .sb-container .search-btn {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 38px;
                    height: 38px;
                    background: #e61c5c;
                    border-radius: 50%;
                    transition: all 0.5s;
                    z-index: 4;
                    cursor: pointer;
                    box-shadow: 0 0 15px rgba(230, 28, 92, 0.3);
                    border: none;
                    outline: none;
                }
                .sb-container .search-btn:hover {
                    background: #f42c6c;
                }
                .sb-container .search-btn::before {
                    content: "";
                    position: absolute;
                    margin: auto;
                    top: 10px;
                    right: 0;
                    bottom: 0;
                    left: 10px;
                    width: 8px;
                    height: 2px;
                    background: white;
                    transform: rotate(45deg);
                    transition: all 0.3s;
                }
                .sb-container .search-btn::after {
                    content: "";
                    position: absolute;
                    margin: auto;
                    top: -3px;
                    right: 0;
                    bottom: 0;
                    left: -3px;
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    border: 2px solid white;
                    transition: all 0.3s;
                }
                .sb-container input {
                    position: absolute;
                    right: 0;
                    top: 1px;
                    width: 36px;
                    height: 36px;
                    outline: none;
                    border: none;
                    background: #e61c5c;
                    color: white;
                    padding: 0 38px 0 15px;
                    border-radius: 18px;
                    box-shadow: 0 0 15px #e61c5c, 0 10px 15px rgba(0, 0, 0, 0.2);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    opacity: 0;
                    z-index: 3;
                    font-weight: 600;
                    font-size: 13px;
                }
                .sb-container.expanded input {
                    width: 100%;
                    opacity: 1;
                    cursor: text;
                    z-index: 5;
                }
                .sb-container.expanded .search-btn {
                    background: #111625;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 6;
                    box-shadow: none;
                }
                .sb-container.expanded .search-btn::before {
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    width: 16px;
                    background: white;
                }
                .sb-container.expanded .search-btn::after {
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    width: 16px;
                    height: 2px;
                    border: none;
                    background: white;
                    border-radius: 0%;
                    transform: rotate(-45deg);
                }
                .sb-container input::placeholder {
                    color: rgba(255, 255, 255, 0.65);
                }
            `}</style>

            <div className={`sb-container ${isExpanded ? "expanded" : ""}`}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                />
                <button
                    onClick={handleSearchClick}
                    className="search-btn"
                    aria-label="Tìm kiếm"
                />
            </div>

            {/* Suggestions & Results Dropdown Box */}
            {isExpanded && (
                <div className="absolute top-12 right-0 w-80 bg-[#111625]/95 border border-white/[0.08] shadow-[0_15px_30px_rgba(230,28,92,0.12)] rounded-2xl p-3 z-50 max-h-[420px] overflow-y-auto mt-1 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                            <p className="text-[11px] text-muted-foreground font-sans">Đang tìm kiếm...</p>
                        </div>
                    ) : query.trim() ? (
                        results.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-[10px] text-muted-foreground px-1 font-sans">
                                    Tìm thấy {results.length} bài viết liên quan
                                </p>
                                <div className="space-y-1">
                                    {results.map((post) => {
                                        const url = getPostUrl(post.metadata.type, post.slug)
                                        return (
                                            <Link
                                                key={`${post.metadata.type}-${post.slug}`}
                                                href={url}
                                                onClick={() => {
                                                    setIsExpanded(false)
                                                    setQuery("")
                                                }}
                                                className="group block p-2.5 rounded-xl border border-white/[0.02] bg-white/[0.005] hover:bg-white/[0.03] hover:border-accent/30 transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center rounded bg-secondary/80 px-1.5 py-0.5 text-[8px] font-semibold text-secondary-foreground">
                                                        {getTypeLabel(post.metadata.type)}
                                                    </span>
                                                </div>

                                                <h5 className="mt-1 text-xs font-bold font-serif text-white group-hover:text-accent transition-colors duration-300 line-clamp-1">
                                                    {post.metadata.title}
                                                </h5>

                                                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1 leading-normal font-sans">
                                                    {post.metadata.description}
                                                </p>

                                                <div className="mt-2 flex items-center justify-between text-[8px] text-muted-foreground font-sans">
                                                    <span className="flex items-center gap-0.5">
                                                        <Calendar size={8} />
                                                        {new Date(post.metadata.date).toLocaleDateString("vi-VN", {
                                                            year: "numeric",
                                                            month: "short",
                                                        })}
                                                    </span>
                                                    <span className="text-accent flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Xem <ArrowRight size={8} />
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-muted-foreground font-sans">
                                Không tìm thấy kết quả phù hợp cho "{query}"
                            </div>
                        )
                    ) : (
                        /* Suggestions when empty */
                        <div className="space-y-3 py-1">
                            <div>
                                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-sans mb-2">
                                    Từ khóa tìm kiếm phổ biến
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                    {suggestions.map((sug) => (
                                        <button
                                            key={sug}
                                            onClick={() => setQuery(sug)}
                                            className="px-2.5 py-1 text-[10px] font-medium bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-full text-white transition-all active:scale-95"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-1 border-t border-white/[0.04]">
                                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-sans mb-1">
                                    Tìm kiếm nhanh
                                </h5>
                                <p className="text-[9px] text-muted-foreground leading-normal font-sans">
                                    Nhập mã cổ phiếu hoặc từ khóa bất kỳ để quét dữ liệu tự động bên dưới.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
