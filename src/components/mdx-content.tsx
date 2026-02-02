import { MDXRemote } from "next-mdx-remote/rsc"
import { components } from "@/components/mdx-components"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"

interface MdxContentType {
    source: string
}

export function MdxContent({ source }: MdxContentType) {
    return (
        <div className="prose prose-stone dark:prose-invert max-w-none">
            <MDXRemote
                source={source}
                components={components}
                options={{
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: "wrap" }],
                            [
                                rehypePrettyCode,
                                {
                                    theme: "github-dark",
                                    keepBackground: false,
                                },
                            ],
                        ],
                    },
                }}
            />
        </div>
    )
}
