import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URI;

if (!connectionString) {
    throw new Error("DATABASE_URI is not defined");
}

const client = postgres(connectionString, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
});

export const db = drizzle(client);
