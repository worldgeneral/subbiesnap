import {
  serial,
  pgTable,
  pgSchema,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  secondName: text("second_name").notNull(),
});

export type UserSchema = typeof users.$inferSelect;
