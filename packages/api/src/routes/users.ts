import express from "express";
import { registerSchema } from "../zodSchema/userSchema";
import { users } from "../models/users";
import { db } from "../db";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/ExpressError";
import { NeonDbError } from "@neondatabase/serverless";
import { registerUser } from "../services/users";

const usersRoutes = express.Router();

usersRoutes.get(
  "/users",
  tryCatch(async (req, res) => {
    const result = await db.select().from(users);
    res.json(result.map(({ password, ...user }) => user));
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
    res.json(user);
  })
);

export { usersRoutes };
