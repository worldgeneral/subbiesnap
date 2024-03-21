import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { authSchema } from "../zodSchema/authSchema";
import { loginAuthUser } from "../services/auth.service";
import { sessions } from "../schemas";
import { db } from "../db";
import moment from "moment";
import { normalizeUser } from "../services/user.service";
import { randomStringAsBase64Url } from "../utils/uniqueString";
import { createHash } from "crypto";
import { sessionAuth } from "../middleware/sessionAuth";
import { eq } from "drizzle-orm";

const authRoutes = Router();

authRoutes.post(
  "/login",
  tryCatch(async (req: Request, res) => {
    const data = authSchema.parse(req.body);

    const user = await loginAuthUser(data.password, data.email);
    const sessionToken = await randomStringAsBase64Url(128);
    const hashToken = createHash("sha256").update(sessionToken).digest("hex");

    await db.insert(sessions).values({
      userId: user.id,
      sessionToken: hashToken,
      expiresAt: moment().add(7, "days").toDate(),
    });

    res.cookie("session_id", sessionToken);
    res.json(normalizeUser(user));
  })
);

authRoutes.post(
  "/logout",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const { cookies } = req;
    const hashToken = createHash("sha256")
      .update(cookies.session_id)
      .digest("hex");
    const deleteSession = await db
      .delete(sessions)
      .where(eq(sessions.sessionToken, hashToken));

    res.clearCookie("session_id");
    res.json(req.user);
  })
);

export { authRoutes };
