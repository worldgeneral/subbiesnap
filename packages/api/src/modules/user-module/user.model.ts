import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  secondName: text("second_name").notNull(),
  confirmedEmail: timestamp("confirmed_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type UserSchema = typeof usersTable.$inferSelect;
export type UserSchemaInsert = Omit<
  typeof usersTable.$inferInsert,
  "id" | "password"
>;
