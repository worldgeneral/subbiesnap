import * as argon2 from "argon2";
import { createHash } from "crypto";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import jwt from "jsonwebtoken";
import moment from "moment";
import z from "zod";
import { PASSWORD_RESET_EXPIRES_AT } from "../../constants/emails";
import { HttpStatus } from "../../constants/https";
import {
  SESSION_TOKEN_EXPIRE_DAYS,
  SESSION_TOKEN_STRING_LENGTH,
} from "../../constants/session-token";
import { db } from "../../db/db";
import { sessionsTable } from "../../db/schemas";
import { sendEmail } from "../../email-client/send-email";
import {
  passwordResetSubject,
  passwordResetWrapper,
} from "../../email-client/templates/password-reset";
import { AppError } from "../../errors/express-error";
import { randomStringAsBase64Url } from "../../utils/unique-string.utils";
import { verifyToken } from "../../utils/verify-jwt-token";
import { usersTable } from "../user-module/user.model";
import { userSchema } from "../user-module/user.rule";
import { normalizeUser } from "../user-module/user.service";
import { env } from "../../env";

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
  if (user.confirmedEmail === null) {
    throw new AppError(
      "Error user needs to confirm email",
      HttpStatus.Forbidden
    );
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

export async function emailAuth(emailTokenId: string) {
  const token = await verifyToken(emailTokenId, env.JWT_SECRET);
  if (!token || typeof token === "string") {
    throw new AppError("invalid decoded token", HttpStatus.InternalServerError);
  }
  const [user] = await db
    .update(usersTable)
    .set({ confirmedEmail: moment().toDate() })
    .where(eq(usersTable.id, token.userId))
    .returning();

  return normalizeUser(user);
}

export async function resetPasswordEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.email, email),
        isNull(usersTable.deletedAt),
        isNotNull(usersTable.confirmedEmail)
      )
    );
  if (!user) {
    throw new AppError("Error user does not exist", HttpStatus.BadRequest);
  }

  const resetEmailId = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: PASSWORD_RESET_EXPIRES_AT,
  });

  await sendEmail({
    To: [email],
    Subject: passwordResetSubject,
    Body: {
      Html: passwordResetWrapper({
        firstName: user.firstName,
        secondName: user.secondName,
        resetId: resetEmailId,
      }),
      Text: passwordResetWrapper({
        firstName: user.firstName,
        secondName: user.secondName,
        resetId: resetEmailId,
      }),
    },
  });
  return normalizeUser(user);
}

export async function passwordReset(resetId: string, password: string) {
  const verifiedToken = await verifyToken(resetId, env.JWT_SECRET);
  if (!verifiedToken || typeof verifiedToken === "string") {
    throw new AppError("invalid decoded token", HttpStatus.InternalServerError);
  }

  const hashPassword = await argon2.hash(password);

  const [user] = await db
    .update(usersTable)
    .set({ password: hashPassword })
    .where(eq(usersTable.id, verifiedToken.userId))
    .returning();

  return normalizeUser(user);
}
