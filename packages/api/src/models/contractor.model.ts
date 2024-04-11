import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const contractorsTable = pgTable("contractors", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  contractorName: text("solo_trader_name"),
  logo: text("logo"),
  location: text("location"),
  profession: text("profession").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type ContractorsSchema = typeof contractorsTable.$inferSelect;

export const contractorsAccreditations = pgTable("contractors_accreditations", {
  id: serial("id").primaryKey().notNull(),
  subbieId: integer("subbie_id")
    .notNull()
    .references(() => contractorsTable.id, { onDelete: "cascade" }),
  accreditationName: text("accreditation_name"),
  accreditation: text("accreditation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type contractorsAccreditationsSchema =
  typeof contractorsAccreditations.$inferSelect;
