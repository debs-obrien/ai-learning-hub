import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy initialization - only connect when db is actually used
// This prevents build-time errors when DATABASE_URL isn't available
let _db: ReturnType<typeof drizzle> | null = null;

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please set it in your .env.local file or Netlify environment variables."
    );
  }
  return connectionString;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) {
      const connectionString = getConnectionString();
      const client = postgres(connectionString, {
        prepare: false, // Required for Supabase Transaction Pooler
      });
      _db = drizzle(client, { schema });
    }
    return (_db as any)[prop];
  },
});
