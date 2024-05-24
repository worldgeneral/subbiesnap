import { Request, Router } from "express";
import { tryCatch } from "../../errors/try-catch";
import { authSchema } from "./auth.rule";
import {
  emailAuth,
  loginAuthUser,
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

authRoutes.get(
  "/email-auth/:emailAuthId",
  tryCatch(async (req: Request, res) => {
    const emailAuthUser = await emailAuth(req.params.emailAuthId);
    res.json(emailAuthUser);
  })
);

export { authRoutes };
