import {
  serial,
  pgTable,
  timestamp,
  text,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const jobPosts = pgTable("job_posts", {
  id: serial("id").primaryKey().notNull(),
  companyId: integer("company_id").notNull(),
  title: text("title").notNull(),
  startsAt: date("starts_at").notNull(),
  endsAt: date("ends_at"),
  compensation: text("compensation"),
  description: text("description").notNull(),
  location: text("location"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type jobPostsSchema = typeof jobPosts.$inferSelect;
