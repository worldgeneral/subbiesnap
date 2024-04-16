import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { UserSchema, UserSchemaInsert, usersTable } from "../models/user.model";
import { AppError } from "../utils/express.error";
import * as argon2 from "argon2";
import { userSchema } from "../rules/user.rule";
import z from "zod";
import { and, eq, is, isNull } from "drizzle-orm";
import moment from "moment";

export type User = Required<Omit<z.infer<typeof userSchema>, "password">>;

export function normalizeUser(user: UserSchema): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    secondName: user.secondName,
  };
}

export async function getUser(userId: number): Promise<User> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    throw new AppError("user does not exist", 404);
  }

  return normalizeUser(user);
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  secondName: string
): Promise<User> {
  try {
    const hashPassword = await argon2.hash(password);
    const [user] = await db
      .insert(usersTable)
      .values({
        email: email,
        password: hashPassword,
        firstName: firstName,
        secondName: secondName,
      })
      .returning();

    return normalizeUser(user);
  } catch (err) {
    if (err instanceof NeonDbError && err.code === "23505") {
      throw new AppError("User is already registered", 400);
    }
    throw err;
  }
}

export async function updateUser(
  userData: Partial<UserSchemaInsert>,
  userId: number
): Promise<User> {
  const [user] = await db
    .update(usersTable)
    .set({ updatedAt: moment().toDate(), ...userData })
    .where(and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)))
    .returning();

  return normalizeUser(user);
}

export async function deleteUser(userId: number): Promise<User> {
  const [user] = await db
    .update(usersTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(usersTable.id, userId))
    .returning();

  return normalizeUser(user);
}
