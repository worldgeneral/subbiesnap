import { db } from "../db";

import { AppError } from "../utils/ExpressError";
import { eq } from "drizzle-orm";
import { users } from "../models/user.model";
import * as argon2 from "argon2";
import { normalizeUser } from "../services/user.service";
import { sessions } from "../schemas";
import moment from "moment";
import { randomStringAsBase64Url } from "../utils/uniqueString";

async function authUser(password: string, email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError("user does not exist", 401);
  }
  if (!(await argon2.verify(user.password, password))) {
    throw new AppError("password or email is wrong", 401);
  }

  return user;
}

export { authUser };
