import { validateContentRepository } from "./src/lib/mdx.ts"

async function main() {
    const result = await validateContentRepository()
    console.log(
        `Content validation passed: ${result.files} files, ${result.internalLinks} internal links checked.`,
    )
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
})
