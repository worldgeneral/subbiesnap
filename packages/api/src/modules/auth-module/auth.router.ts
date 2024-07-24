import { Request, Router } from "express";
import { tryCatch } from "../../errors/try-catch";
import {
  authSchema,
  emailSchema,
  passwordSchema,
} from "@subbiesnap/types/auth";
import {
  emailAuth,
  loginAuthUser,
  passwordReset,
  resetPasswordEmail,
  userLogin,
  userLogout,
} from "./auth.service";
import { sessionAuth } from "./session-auth.middleware";

const authRoutes = Router();

authRoutes.post(
  "/login",
  tryCatch(async (req: Request, res) => {
    const data = authSchema.parse(req.body);
    const user = await loginAuthUser(data.password, data.email);
    const sessionToken = await userLogin(user.id);

    res.cookie("session_id", sessionToken);
    res.json(user);
  })
);

authRoutes.post(
  "/logout",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const { cookies } = req;
    await userLogout(cookies.session_id);

    res.clearCookie("session_id");
    res.json(req.user);
  })
);
// needs to change to post then site is up
authRoutes.get(
  "/email-auth/:emailTokenId",
  tryCatch(async (req: Request, res) => {
    const emailAuthUser = await emailAuth(req.params.emailTokenId);
    res.json(emailAuthUser);
  })
);

authRoutes.get(
  "/password-reset",
  tryCatch(async (req: Request, res) => {
    const data = emailSchema.parse(req.body);
    const user = await resetPasswordEmail(data.email);
    res.json(user);
  })
);

// needs to change to post then site is up
authRoutes.get(
  "/password-reset/:resetTokenId",
  tryCatch(async (req: Request, res) => {
    const data = passwordSchema.parse(req.body);
    const user = await passwordReset(req.params.resetTokenId, data.password);
    res.json(user);
  })
);

export { authRoutes };
