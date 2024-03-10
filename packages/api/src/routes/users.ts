import express from "express";
import { registerSchema } from "../zodSchema/userSchema";
import { users } from "../models/users";
import { db } from "../db";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/ExpressError";
import { NeonDbError } from "@neondatabase/serverless";

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

    try {
      const [{ password, ...user }] = await db
        .insert(users)
        .values({
          password: data.password,
          email: data.email,
          firstName: data.firstName,
          secondName: data.secondName,
        })
        .returning();

      res.json(user);
    } catch (err) {
      if (err instanceof NeonDbError && err.code === "23505") {
        throw new AppError("User is already registered", 400);
      }
      throw err;
    }
  })
);

export { usersRoutes };
