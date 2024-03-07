import express from "express";
import { registerSchema } from "../zodSchema/userSehema";
import { users } from "../models/users";
import { db } from "../db";

const usersRoutes = express.Router();

usersRoutes.get("/", async (req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});
usersRoutes.post("/", async (req, res) => {
  const data = registerSchema.parse(req.body);

  await db.insert(users).values({
    password: data.password,
    email: data.email,
    firstName: data.firstName,
    secondName: data.secondName,
  });
});

export { usersRoutes };
