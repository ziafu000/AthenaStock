import { Search } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { getAllContent } from "@/lib/mdx"

export const metadata = {
    title: "Tìm kiếm",
    description: "Tìm bài viết, phân tích doanh nghiệp, framework và nội dung tâm lý đầu tư trên Athena Stock.",
}

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

function normalize(value: string) {
    return value.trim().toLocaleLowerCase("vi-VN")
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "" } = await searchParams
    const query = normalize(q)
    const posts = await getAllContent()
    const results = query
        ? posts.filter((post) => {
            const searchableText = [
                post.metadata.title,
                post.metadata.description,
                post.metadata.type,
                ...(post.metadata.tags ?? []),
                ...(post.metadata.tickers ?? []),
            ]
                .join(" ")
                .toLocaleLowerCase("vi-VN")

            return searchableText.includes(query)
        })
        : []

    return (
        <div className="min-h-screen">
            <section className="border-b bg-secondary/30 py-12 md:py-16">
                <div className="container max-w-3xl">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Search className="h-6 w-6" />
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl">Tìm kiếm</h1>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Tìm theo chủ đề, mã cổ phiếu, framework hoặc từ khóa trong mô tả bài viết.
                    </p>

                    <form action="/search" className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            name="q"
                            defaultValue={q}
                            placeholder="Ví dụ: FPT, margin of safety, FOMO..."
                            className="h-12 min-w-0 flex-1 rounded-md border bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                        />
                        <button
                            type="submit"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Tìm
                        </button>
                    </form>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container max-w-5xl">
                    {query ? (
                        <>
                            <p className="mb-6 text-sm text-muted-foreground">
                                {results.length > 0
                                    ? `${results.length} kết quả cho "${q}"`
                                    : `Không tìm thấy kết quả cho "${q}"`}
                            </p>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.map((post) => (
                                    <PostCard key={`${post.metadata.type}-${post.slug}`} post={post} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-muted-foreground">
                            Nhập từ khóa để bắt đầu tìm trong toàn bộ thư viện nội dung.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
