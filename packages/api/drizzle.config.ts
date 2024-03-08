import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/models/users.ts",
  out: "./drizzle",
  driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME!,
    ssl: true,
  },
} satisfies Config;
