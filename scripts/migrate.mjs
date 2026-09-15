import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import postgres from "postgres"

function loadDatabaseUrl() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL
    }

    try {
        const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf8")
        for (const line of envFile.split("\n")) {
            const trimmed = line.trim()
            if (trimmed.startsWith("DATABASE_URL=")) {
                return trimmed.slice("DATABASE_URL=".length).replace(/^["']|["']$/g, "")
            }
        }
    } catch {
        // Ignored
    }

    throw new Error("Could not find DATABASE_URL in process.env or .env.local")
}

async function runMigrations() {
    const databaseUrl = loadDatabaseUrl()
    const sql = postgres(databaseUrl, {
        ssl: "require",
        max: 1,
        connect_timeout: 10,
        prepare: false,
    })

    try {
        console.log("Ensuring schema_migrations table exists...")
        await sql`
            CREATE TABLE IF NOT EXISTS public.schema_migrations (
                filename varchar(255) PRIMARY KEY,
                applied_at timestamptz NOT NULL DEFAULT now()
            )
        `

        const appliedRows = await sql`SELECT filename FROM public.schema_migrations`
        const appliedFiles = new Set(appliedRows.map((r) => r.filename))

        const migrationsDir = join(process.cwd(), "database", "migrations")
        const files = readdirSync(migrationsDir)
            .filter((f) => f.endsWith(".sql"))
            .sort()

        console.log(`Found ${files.length} migration files in total.`)

        for (const file of files) {
            if (appliedFiles.has(file)) {
                console.log(`[SKIPPED] ${file} (already applied)`)
                continue
            }

            console.log(`[APPLYING] ${file}...`)
            const filePath = join(migrationsDir, file)
            const content = readFileSync(filePath, "utf8")

            await sql.unsafe(content)
            await sql`
                INSERT INTO public.schema_migrations (filename)
                VALUES (${file})
                ON CONFLICT (filename) DO NOTHING
            `
            console.log(`[APPLIED] ${file}`)
        }

        console.log("All migrations executed successfully!")
    } finally {
        await sql.end()
    }
}

runMigrations().catch((err) => {
    console.error("Migration failed:", err)
    process.exit(1)
})
