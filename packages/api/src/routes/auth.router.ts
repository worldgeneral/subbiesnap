import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { authSchema } from "../rules/auth.rule";
import { loginAuthUser, userLogin, userLogout } from "../services/auth.service";
import { sessionAuth } from "../middleware/session.auth";

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

export { authRoutes };
