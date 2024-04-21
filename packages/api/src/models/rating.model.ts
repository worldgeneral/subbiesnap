import {
  serial,
  pgTable,
  timestamp,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const ratingsTable = pgTable("ratings", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  tableRef: text("table_ref").$type<TableRef>().notNull(),
  refId: integer("ref_id").notNull(),
  rating: integer("rating").$type<rating>().notNull(),
});

export type TableRef = "contractor" | "company";

export type rating = 1 | 2 | 3 | 4 | 5;

export type ratingsTableSchema = typeof ratingsTable.$inferSelect;
export type ratingsTableSchemaInsert = Omit<
  typeof ratingsTable.$inferInsert,
  "id"
>;
