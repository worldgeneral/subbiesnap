import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export const client = new Client({
  connectionString: process.env.DB_URL!,
});

export const db = drizzle(client);
