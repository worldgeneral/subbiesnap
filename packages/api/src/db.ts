import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon<boolean, boolean>(process.env.DB_URL!);
const db = drizzle(sql);

export { db };
