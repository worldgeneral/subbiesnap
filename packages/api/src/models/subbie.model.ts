import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const subbie = pgTable("subbies", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  soloTraderName: text("solo_trader_name"),
  logo: text("logo"),
  location: text("location"),
  profession: text("profession").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type SubbieSchema = typeof subbie.$inferSelect;

export const subbieAccreditation = pgTable("subbie_accreditation", {
  id: serial("id").primaryKey().notNull(),
  subbieId: integer("subbie_id")
    .notNull()
    .references(() => subbie.id, { onDelete: "cascade" }),
  accreditationName: text("accreditation_name"),
  accreditation: text("accreditation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type SubbieAccreditationSchema = typeof subbieAccreditation.$inferSelect;
