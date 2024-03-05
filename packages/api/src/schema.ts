import { mysqlTable, bigint, varchar, date } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {});
