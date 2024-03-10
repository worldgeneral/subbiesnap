import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { users } from "../models/users";
import { AppError } from "../utils/ExpressError";

async function registerUser(
  email: string,
  pass: string,
  firstName: string,
  secondName: string
) {
  try {
    const [{ password, ...user }] = await db
      .insert(users)
      .values({
        email: email,
        password: pass,
        firstName: firstName,
        secondName: secondName,
      })
      .returning();

    return user;
  } catch (err) {
    if (err instanceof NeonDbError && err.code === "23505") {
      throw new AppError("User is already registered", 400);
    }
    throw err;
  }
}
export { registerUser };
