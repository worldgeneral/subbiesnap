import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type SessionsSchema = typeof sessions.$inferSelect;
