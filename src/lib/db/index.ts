import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres client - use connection pooling settings for serverless
const client = postgres(connectionString, {
  prepare: false, // Disables prepared statements (required for Supabase Transaction Pooler)
});

export const db = drizzle(client, { schema });
