const rawBaseUrl = process.argv[2] || process.env.SMOKE_BASE_URL || "http://localhost:3000"
let baseUrl

try {
    const parsed = new URL(rawBaseUrl)
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("unsupported protocol")
    baseUrl = parsed.origin
} catch {
    console.error(`Invalid smoke-test URL: ${rawBaseUrl}`)
    process.exit(1)
}

const publicRoutes = [
    "/",
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
const failures = []
let checks = 0

async function request(path, init) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)
    try {
        return await fetch(`${baseUrl}${path}`, {
            redirect: "follow",
            ...init,
            signal: controller.signal,
            headers: { "User-Agent": "AthenaStock-release-smoke/1.0", ...init?.headers },
        })
    } finally {
        clearTimeout(timeout)
    }
}

async function expectStatus(name, path, expected, init) {
    checks += 1
    try {
        const response = await request(path, init)
        if (response.status !== expected) {
            failures.push(`${name}: expected ${expected}, received ${response.status}`)
        }
        return response
    } catch (error) {
        failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`)
        return null
    }
}

await Promise.all(publicRoutes.map((path) => expectStatus(`public ${path}`, path, 200)))

const robotsResponse = await expectStatus("robots", "/robots.txt", 200)
if (robotsResponse) {
    const robots = await robotsResponse.text()
    for (const expected of [
        "Disallow: /api/",
        "Disallow: /admin/",
        "Disallow: /booking/",
        `Host: ${baseUrl}`,
        `Sitemap: ${baseUrl}/sitemap.xml`,
    ]) {
        checks += 1
        if (!robots.includes(expected)) failures.push(`robots: missing ${expected}`)
    }
}

const sitemapResponse = await expectStatus("sitemap", "/sitemap.xml", 200)
if (sitemapResponse) {
    const sitemap = await sitemapResponse.text()
    for (const path of publicRoutes) {
        checks += 1
        const locations = path === "/" ? [baseUrl, `${baseUrl}/`] : [`${baseUrl}${path}`]
        if (!locations.some((location) => sitemap.includes(`<loc>${location}</loc>`))) {
            failures.push(`sitemap: missing ${locations[0]}`)
        }
    }
    for (const privatePath of ["/api/", "/admin/", "/booking/"]) {
        checks += 1
        if (sitemap.includes(privatePath)) failures.push(`sitemap: exposes ${privatePath}`)
    }
}

const searchResponse = await expectStatus("search success", "/api/search?q=FPT", 200)
if (searchResponse) {
    checks += 2
    try {
        const results = await searchResponse.json()
        if (!Array.isArray(results) || results.length > 20) failures.push("search: invalid or unbounded result list")
        if (Array.isArray(results) && results.some((result) => "content" in result)) failures.push("search: response exposes full content")
    } catch {
        failures.push("search: response is not valid JSON")
    }
    if (!searchResponse.headers.get("cache-control")?.includes("s-maxage=300")) {
        failures.push("search: missing shared-cache contract")
    }
}

await expectStatus("search length validation", `/api/search?q=${"x".repeat(81)}`, 400)
await expectStatus("availability validation", "/api/booking/availability?date=invalid", 400)
await expectStatus("subscription validation", "/api/subscribe", 400, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "invalid" }),
})
await expectStatus("booking abuse control", "/api/booking", 400, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
})
await expectStatus("admin authentication", "/api/admin/bookings", 401)

const actionToken = `00000000-0000-4000-8000-000000000000.${"x".repeat(43)}`
for (const action of ["confirm", "reschedule", "respond", "cancel"]) {
    await expectStatus(`${action} invalid token`, `/api/booking/${action}?token=${actionToken}`, 403)
}
await expectStatus("unsubscribe invalid token", `/api/subscribe/unsubscribe?token=${"x".repeat(43)}`, 403)

if (failures.length) {
    console.error(`HTTP smoke failed for ${baseUrl} (${failures.length}/${checks} failed):\n${failures.map((failure) => `- ${failure}`).join("\n")}`)
    process.exitCode = 1
} else {
    console.log(`HTTP smoke passed for ${baseUrl}: ${checks} non-mutating checks.`)
}
