import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"

const root = process.cwd()
const publicRoutes = [
    "",
    "/about",
    "/advisory",
    "/articles",
    "/business",
    "/psychology",
    "/frameworks",
    "/series",
    "/library",
    "/disclaimer",
]
const exactInternalRoutes = new Set([
    "/",
    ...publicRoutes.filter(Boolean),
    "/admin/bookings",
    "/booking/cancel",
    "/booking/reschedule",
    "/booking/respond",
])
const dynamicPrefixes = ["/articles/", "/business/", "/frameworks/", "/psychology/"]
const failures = []

function fail(message) {
    failures.push(message)
}

function read(path) {
    return readFileSync(join(root, path), "utf8")
}

function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name)
        if (entry.isDirectory()) return walk(path)
        return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : []
    })
}

function routeExists(route) {
    const routePath = route === "" ? "src/app/page.tsx" : `src/app${route}/page.tsx`
    return existsSync(join(root, routePath))
}

function isKnownInternalRoute(route) {
    return exactInternalRoutes.has(route) || dynamicPrefixes.some((prefix) => route.startsWith(prefix))
}

for (const route of publicRoutes) {
    if (!routeExists(route)) fail(`Missing public page for ${route || "/"}`)
}

const sitemap = read("src/app/sitemap.ts")
const staticRouteBlock = sitemap.match(/const staticRoutes\s*=\s*\[([\s\S]*?)\]/)
if (!staticRouteBlock) {
    fail("Cannot read staticRoutes from src/app/sitemap.ts")
} else {
    const sitemapRoutes = [...staticRouteBlock[1].matchAll(/"([^"]*)"/g)].map((match) => match[1])
    if (JSON.stringify([...sitemapRoutes].sort()) !== JSON.stringify([...publicRoutes].sort())) {
        fail(`Sitemap routes differ from public route contract: ${sitemapRoutes.join(", ")}`)
    }
}
if (sitemap.includes("lastModified: new Date(),")) {
    fail("Static sitemap entries must not receive a new timestamp on every build")
}

const robots = read("src/app/robots.ts")
for (const path of ["/api/", "/admin/", "/booking/"]) {
    if (!robots.includes(`"${path}"`)) fail(`robots.ts does not exclude ${path}`)
}
if (!robots.includes("host: siteConfig.url")) fail("robots.ts does not declare the canonical host")

const sourceFiles = walk(join(root, "src"))
for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8")
    const candidates = [
        ...source.matchAll(/href\s*=\s*["'](\/[^"'#?]*)["']/g),
        ...source.matchAll(/slug\s*:\s*["'](\/[^"'#?]*)["']/g),
    ]
    for (const match of candidates) {
        if (!isKnownInternalRoute(match[1])) {
            fail(`${relative(root, file)} references unknown internal route ${match[1]}`)
        }
    }
}

if (failures.length) {
    console.error("Route validation failed:\n" + failures.map((message) => `- ${message}`).join("\n"))
    process.exitCode = 1
} else {
    console.log(`Route validation passed: ${publicRoutes.length} public routes and ${sourceFiles.length} source files checked.`)
}
