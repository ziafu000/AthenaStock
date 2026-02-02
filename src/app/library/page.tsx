import Link from "next/link"
import { BookOpen, Quote, ListChecks, BookMarked, Library } from "lucide-react"

export const metadata = {
    title: "Library – Đầu tư tỉnh thức",
    description: "Tài nguyên học tập: sách, trích dẫn, thuật ngữ, và checklist.",
}

const resources = [
    {
        title: "Sách hay nên đọc",
        description: "Danh sách curated các cuốn sách về đầu tư giá trị và tâm lý học.",
        icon: BookOpen,
        href: "/library/books",
        comingSoon: true,
        color: "blue",
    },
    {
        title: "Trích dẫn kinh điển",
        description: "Những câu nói đáng suy ngẫm từ Buffett, Munger, Graham...",
        icon: Quote,
        href: "/library/quotes",
        comingSoon: true,
        color: "orange",
    },
    {
        title: "Thuật ngữ (Glossary)",
        description: "Giải thích các khái niệm tài chính bằng ngôn ngữ đơn giản.",
        icon: BookMarked,
        href: "/library/glossary",
        comingSoon: true,
        color: "green",
    },
    {
        title: "Checklists",
        description: "Các danh sách kiểm tra có thể in ra và sử dụng.",
        icon: ListChecks,
        href: "/frameworks",
        color: "purple",
    },
]

const colorClasses = {
    blue: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    orange: "bg-orange-100/50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
    green: "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    purple: "bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
}

export default function LibraryPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/30">
                <div className="container max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                        <Library className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        Library
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Tài nguyên để học tập và tra cứu. Đọc chậm, ghi chú cẩn thận.
                    </p>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {resources.map((resource) => {
                            const Icon = resource.icon
                            const colorClass = colorClasses[resource.color as keyof typeof colorClasses] || colorClasses.blue

                            return (
                                <Link
                                    key={resource.title}
                                    href={resource.comingSoon ? "#" : resource.href}
                                    className={`group block rounded-2xl border bg-card p-6 space-y-4 transition-all ${resource.comingSoon
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:shadow-lg hover:border-accent/40 hover:-translate-y-1"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClass}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        {resource.comingSoon && (
                                            <span className="text-xs text-muted-foreground border px-2 py-0.5 rounded-full">
                                                Sắp có
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold mb-2">{resource.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {resource.description}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Notes Section */}
            <section className="py-12 bg-muted/30">
                <div className="container max-w-4xl">
                    <div className="rounded-2xl border bg-background p-8">
                        <h2 className="text-xl font-serif font-bold mb-4">📝 Ghi chú của bạn</h2>
                        <p className="text-muted-foreground mb-6">
                            Các highlight và ghi chú bạn đã lưu khi đọc bài sẽ hiển thị ở đây.
                        </p>
                        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-muted/30">
                            <p className="font-medium">Chức năng ghi chú đang được phát triển.</p>
                            <p className="text-sm mt-2">
                                Dữ liệu sẽ được lưu trữ trên trình duyệt của bạn (localStorage).
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
