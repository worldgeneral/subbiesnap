import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { sessionsTable, usersTable } from "../schemas";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/express.error";
import { createHash } from "crypto";
import { tryCatch } from "../utils/try.catch";
import moment from "moment";
import { normalizeUser } from "../services/user.service";
import { sessionTokenExpireDays } from "../utils/magic.numbers";

const sessionAuth = tryCatch(async function (
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
      throw new AppError("not authorized", 401);
    }

    if (
      moment(session.sessions.expiresAt).isBefore(
        moment()
          .add(sessionTokenExpireDays - 1, "days")
          .toDate()
      )
    ) {
      await db
        .update(sessionsTable)
        .set({ expiresAt: moment().add(7, "days").toDate() })
        .where(eq(sessionsTable.id, session.sessions.id));
    }
    req.user = normalizeUser(session.users);

    return next();
  }
  throw new AppError("not authorized", 401);
});

export { sessionAuth };
