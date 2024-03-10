import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { UserSchema, users } from "../models/users";
import { AppError } from "../utils/ExpressError";

type User = {
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
    const [user] = await db
      .insert(users)
      .values({
        email: email,
        password: password,
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
