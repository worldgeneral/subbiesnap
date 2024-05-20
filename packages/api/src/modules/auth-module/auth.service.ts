import * as argon2 from "argon2";
import { createHash } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";
import z from "zod";
import { HttpStatus } from "../../constants/https";
import {
  SESSION_TOKEN_EXPIRE_DAYS,
  SESSION_TOKEN_STRING_LENGTH,
} from "../../constants/session-token";
import { db } from "../../db/db";
import { sessionsTable } from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { randomStringAsBase64Url } from "../../utils/unique-string.utils";
import { usersTable } from "../user-module/user.model";
import { userSchema } from "../user-module/user.rule";
import { normalizeUser } from "../user-module/user.service";

export type login = Required<
  Omit<z.infer<typeof userSchema>, "id" | "firstName" | "secondName">
>;

export async function loginAuthUser(password: string, email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (!user) {
    throw new AppError("user does not exist", HttpStatus.BadRequest);
  }
  if (!(await argon2.verify(user.password, password))) {
    throw new AppError("password or email is wrong", HttpStatus.Unauthorized);
  }

  return normalizeUser(user);
}

export async function userLogin(userId: number) {
  const sessionToken = await randomStringAsBase64Url(
    SESSION_TOKEN_STRING_LENGTH
  );
  const hashToken = createHash("sha256").update(sessionToken).digest("hex");

  await db.insert(sessionsTable).values({
    userId: userId,
    sessionToken: hashToken,
    expiresAt: moment().add(SESSION_TOKEN_EXPIRE_DAYS, "days").toDate(),
  });

  return sessionToken;
}

export async function userLogout(sessionToken: string) {
  const hashToken = createHash("sha256").update(sessionToken).digest("hex");
  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.sessionToken, hashToken));

  return;
}
