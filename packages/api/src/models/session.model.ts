import { serial, pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").unique().notNull(),
});

export type SessionsSchema = typeof sessionsTable.$inferSelect;
export type SessionsSchemaInsert = Omit<
  typeof sessionsTable.$inferInsert,
  "id"
>;
