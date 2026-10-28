import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __cdmPool?: Pool; __cdmDb?: Db };

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

/** Returns the Drizzle client, or null when DATABASE_URL is not configured. */
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.__cdmDb) {
    const pool = new Pool({
      connectionString: url,
      max: 5,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    });
    globalForDb.__cdmPool = pool;
    globalForDb.__cdmDb = drizzle(pool, { schema });
  }
  return globalForDb.__cdmDb;
}

export { schema };
