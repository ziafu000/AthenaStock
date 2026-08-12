import postgres from "postgres"

const globalForDatabase = globalThis as typeof globalThis & {
    bookingSql?: ReturnType<typeof postgres>
}

export function getDatabase() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error("Thiếu DATABASE_URL.")

    if (!globalForDatabase.bookingSql) {
        globalForDatabase.bookingSql = postgres(connectionString, {
            max: process.env.NODE_ENV === "production" ? 5 : 2,
            idle_timeout: 20,
            connect_timeout: 10,
            prepare: false,
        })
    }
    return globalForDatabase.bookingSql
}

export type BookingTransaction = postgres.TransactionSql

