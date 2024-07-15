import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";

export const pool = new Pool({
  connectionString: env.DB_URL,
});

export const db = drizzle(pool);
