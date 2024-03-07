import {
  int,
  mysqlTable,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: timestamp("created_at", { mode: "date", fsp: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", fsp: 6 })
    .defaultNow()
    .notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  secondName: varchar("second_name", { length: 255 }).notNull(),
});
