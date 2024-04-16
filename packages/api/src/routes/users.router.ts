import { Router, Request, Response } from "express";
import { registerSchema, updateUserSchema } from "../rules/user.rule";
import { tryCatch } from "../utils/try.catch";
import {
  deleteUser,
  getUser,
  registerUser,
  updateUser,
} from "../services/user.service";
import { sessionAuth } from "../middleware/session.auth";
import { companiesRoutes } from "./companies.router";

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
    res.json(user).status(201);
  })
);

usersRoutes.patch(
  "users/:userId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = updateUserSchema.parse(req.body);
    const userId = Number(req.params.userId);
    const user = updateUser(data, userId);

    res.json(user);
  })
);

usersRoutes.delete(
  "users/:userId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const userId = Number(req.params.userId);
    const user = deleteUser(userId);
    res.json(user);
  })
);

export { usersRoutes };
