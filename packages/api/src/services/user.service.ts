import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { UserSchema, users } from "../models/user.model";
import { AppError } from "../utils/ExpressError";
import * as argon2 from "argon2";

export type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string;
  secondName: string;
};

function normalizeUser(user: UserSchema): User {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    firstName: user.firstName,
    secondName: user.secondName,
  };
}

async function registerUser(
  email: string,
  password: string,
  firstName: string,
  secondName: string
): Promise<User> {
  try {
    const hashPassword = await argon2.hash(password);
    const [user] = await db
      .insert(users)
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
export { registerUser, normalizeUser };
