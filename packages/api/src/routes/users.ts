import express from "express";
import { registerSchema } from "../zodSchema/userSehema";
import { users } from "../models/users";
import { db } from "../db";
import { eq } from "drizzle-orm";

const usersRoutes = express.Router();

usersRoutes.get("/", async (req, res) => {
  const result = await db.select().from(users);
  res.json(result.map(({ password, ...user }) => user));
});
usersRoutes.post("/", async (req, res) => {
  const data = registerSchema.parse(req.body);

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
});

export { usersRoutes };
