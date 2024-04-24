import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { real } from "drizzle-orm/pg-core";

export const contractorsTable = pgTable("contractors", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  name: text("solo_trader_name"),
  logo: text("logo"),
  location: text("location"),
  profession: text("profession").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  avgRating: real("avg_rating").default(0),
  timesRated: integer("times_rated").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type ContractorsSchema = typeof contractorsTable.$inferSelect;
export type ContractorsSchemaInsert = Omit<
  typeof contractorsTable.$inferInsert,
  "id"
>;

export const contractorsAccreditations = pgTable("contractors_accreditations", {
  id: serial("id").primaryKey().notNull(),
  contractorId: integer("contractor_id")
    .notNull()
    .references(() => contractorsTable.id, { onDelete: "cascade" }),
  name: text("accreditation_name").notNull(),
  accreditation: text("accreditation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type ContractorsAccreditationsSchema =
  typeof contractorsAccreditations.$inferSelect;
export type ContractorsAccreditationsSchemaInsert = Omit<
  typeof contractorsAccreditations.$inferInsert,
  "id"
>;
