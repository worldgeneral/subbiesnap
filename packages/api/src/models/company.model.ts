import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { CompanyStatus } from "../utils/magic.numbers";
import { real } from "drizzle-orm/pg-core";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey().notNull(),
  ownerId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  logo: text("logo"),
  blurb: text("blurb"),
  status: text("status").default(CompanyStatus.Active),
  avgRating: real("avg_rating").default(0),
  timesRated: integer("times_rated").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type CompaniesSchema = typeof companiesTable.$inferSelect;
export type CompaniesSchemaInsert = Omit<
  typeof companiesTable.$inferInsert,
  "id"
>;

export const companiesUsersTable = pgTable("companies_users", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companiesTable.id, { onDelete: "cascade" }),
  role: integer("role").notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type CompaniesUsersSchema = typeof companiesUsersTable.$inferSelect;
export type CompaniesUsersSchemaInsert = Omit<
  typeof companiesUsersTable.$inferInsert,
  "id"
>;
