import { unique } from "drizzle-orm/pg-core";
import {
  serial,
  pgTable,
  timestamp,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const ratingsTable = pgTable(
  "ratings",
  {
    id: serial("id").primaryKey().notNull(),
    rateableType: text("rateable_type").$type<RateableType>().notNull(),
    rateableModelId: integer("rateable_model_id").notNull(),
    rating: integer("rating").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    unq: unique().on(t.userId, t.rateableModelId),
  })
);

export enum RateableType {
  Contractors = "contractors",
  Companies = "companies",
}

export type ratingsTableSchema = typeof ratingsTable.$inferSelect;
export type ratingsTableSchemaInsert = Omit<
  typeof ratingsTable.$inferInsert,
  "id"
>;
