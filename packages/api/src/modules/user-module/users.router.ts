import { Request, Router } from "express";
import { HttpStatus } from "../../../../constants/https";
import { tryCatch } from "../../errors/try-catch";
import { sessionAuth } from "../auth-module/session-auth.middleware";
import { registerSchema, updateUserSchema } from "@subbiesnap/types/users";
import { deleteUser, getUser, registerUser, updateUser } from "./user.service";

const usersRoutes = Router();

usersRoutes.get(
  "/users/:userId",
  tryCatch(async (req: Request, res) => {
    const userId = Number(req.params.userId);
    const user = await getUser(userId);

    res.json(user);
  })
);

usersRoutes.post(
  "/users",
  tryCatch(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(
      data.email,
      data.password,
      data.firstName,
      data.secondName
    );
    res.json(user).status(HttpStatus.Created);
  })
);

usersRoutes.patch(
  "/users/:userId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = updateUserSchema.parse(req.body);
    const user = await updateUser(data, req.user!.id);

    res.json(user);
  })
);

usersRoutes.delete(
  "/users/:userId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const user = await deleteUser(req.user!.id);
    res.json(user);
  })
);

export { usersRoutes };
