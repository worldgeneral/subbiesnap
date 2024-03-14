import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { authSchema } from "../zodSchema/authSchema";
import { authUser } from "../services/auth.service";
import { sessions } from "../schemas";
import { db } from "../db";
import moment from "moment";
import { normalizeUser } from "../services/user.service";
import { randomStringAsBase64Url } from "../utils/uniqueString";
import * as argon2 from "argon2";

const authRoutes = Router();

authRoutes.post(
  "/login",
  tryCatch(async (req: Request, res) => {
    const data = authSchema.parse(req.body);

    const user = await authUser(data.password, data.email);

    const sessionToken = await randomStringAsBase64Url(128);
    const hashToken = await argon2.hash(sessionToken);

    await db.insert(sessions).values({
      userId: user.id,
      sessionToken: hashToken,
      expiresAt: moment().add(7, "days").toDate(),
    });

    res.json(normalizeUser(user));
    res.setHeader("id", sessionToken);
  })
);

export { authRoutes };
