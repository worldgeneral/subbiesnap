import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { sessions, users } from "../schemas";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/ExpressError";
import { createHash } from "crypto";
import { tryCatch } from "../utils/tryCatch";
import moment from "moment";
import { normalizeUser } from "../services/user.service";

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
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(eq(sessions.sessionToken, hashedSessionToken));

    if (!session || moment().isAfter(session.sessions.expiresAt)) {
      throw new AppError("not authorized", 401);
    }

    if (
      moment(session.sessions.expiresAt).isBefore(
        moment().add(6, "days").toDate()
      )
    ) {
      await db
        .update(sessions)
        .set({ expiresAt: moment().add(7, "days").toDate() })
        .where(eq(sessions.id, session.sessions.id));
    }
    req.user = normalizeUser(session.users);

    return next();
  }
  throw new AppError("not authorized", 401);
});

export { sessionAuth };
