import {
  int,
  mysqlTable,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: timestamp("created_at", { mode: "date", fsp: 6 }),
  updatedAt: timestamp("updated_at", { mode: "date", fsp: 6 }),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  secondName: varchar("second_name", { length: 255 }),
});
