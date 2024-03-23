import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const companys = pgTable("companys", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  owner: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type CompanysSchema = typeof companys.$inferSelect;

export const companyUsers = pgTable("companyUsers", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companys.id, { onDelete: "cascade" }),
  role: text("name").notNull(),
});

export type CompanyUsersSchema = typeof companyUsers.$inferSelect;
