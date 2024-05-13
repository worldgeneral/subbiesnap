import { pgEnum } from "drizzle-orm/pg-core";
import { json, unique } from "drizzle-orm/pg-core";
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
    reviewerType: text("reviewer_type").notNull(),
    reviewerTypeId: integer("reviewer_type_id").notNull(),
    revieweeType: text("reviewee_type").notNull(),
    revieweeTypeId: integer("Reviewee_type_id").notNull(),
    ratingValue: integer("rating_value").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    unq2: unique().on(t.revieweeTypeId, t.reviewerTypeId),
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
