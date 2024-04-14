import {
  serial,
  pgTable,
  timestamp,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { companies } from "./company.model";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey().notNull(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  startsAt: date("starts_at", { mode: "date" }).notNull(),
  endsAt: date("ends_at", { mode: "date" }),
  compensationValueMin: integer("compensation_value_min"),
  compensationValueMax: integer("compensation_value_max"),
  compensationSuffix: text("compensation_suffix"),
  description: text("description").notNull(),
  location: text("location"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type JobPostsSchema = typeof jobsTable.$inferSelect;
export type JobPostsSchemaInsert = Omit<typeof jobsTable.$inferInsert, "id">;
