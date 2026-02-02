import { getAllPosts } from "./src/lib/mdx"

async function main() {
    console.log("Testing getAllPosts('article')...");
    try {
        const posts = await getAllPosts("article");
        console.log("Found posts:", posts.length);
        posts.forEach(p => console.log("-", p.slug));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
