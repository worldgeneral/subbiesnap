import { Router, Request, Response } from "express";
import { registerSchema } from "../zodSchema/userSchema";
import { users } from "../models/user.model";
import { db } from "../db";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/ExpressError";
import { normalizeUser, registerUser } from "../services/user.service";
import { eq } from "drizzle-orm";

const usersRoutes = Router();

usersRoutes.get(
  "/users",
  tryCatch(async (req, res) => {
    const result = await db.select().from(users);
    res.json(result.map(normalizeUser));
  })
);

usersRoutes.get(
  "/users/:id",
  tryCatch(async (req: Request<{ id: string }>, res) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(req.params.id)));
    console.log(user);
    if (!user) {
      throw new AppError("user does not exist", 404);
    }
    res.json(normalizeUser(user));
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
