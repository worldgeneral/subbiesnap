import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { HttpStatus } from "@subbiesnap/constants";
import { SESSION_TOKEN_EXPIRE_DAYS } from "../../constants/session-token";
import { db } from "../../db/db";
import { sessionsTable, usersTable } from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { tryCatch } from "../../errors/try-catch";
import { normalizeUser } from "../user-module/user.service";

export const sessionAuth = tryCatch(async function (
  req: Request,
  Res: Response,
  next: NextFunction
) {
  const { cookies } = req;
  if ("session_id" in cookies) {
    const hashedSessionToken = createHash("sha256")
      .update(cookies.session_id)
      .digest("hex");

    const [session] = await db
      .select()
      .from(sessionsTable)
      .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
      .where(eq(sessionsTable.sessionToken, hashedSessionToken));

    if (!session || moment().isAfter(session.sessions.expiresAt)) {
      throw new AppError("not authorized", HttpStatus.Unauthorized);
    }

    if (session.users.confirmedEmail === null) {
      throw new AppError(
        "Error user need to confirm email address",
        HttpStatus.Unauthorized
      );
    }

    if (
      moment(session.sessions.expiresAt).isBefore(
        moment()
          .add(SESSION_TOKEN_EXPIRE_DAYS - 1, "days")
          .toDate()
      )
    ) {
      await db
        .update(sessionsTable)
        .set({
          expiresAt: moment().add(SESSION_TOKEN_EXPIRE_DAYS, "days").toDate(),
        })
        .where(eq(sessionsTable.id, session.sessions.id));
    }
    req.user = normalizeUser(session.users);

    return next();
  }
  throw new AppError("not authorized", HttpStatus.Unauthorized);
});
