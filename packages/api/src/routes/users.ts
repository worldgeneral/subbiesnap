import express from "express";
import { registerSchema } from "src/zodSchema/userSehema";
import { users } from "../models/users";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});
router.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);

  await db.insert(users).values({
    password: data.password,
    email: data.email,
    firstName: data.firstName,
    secondName: data.secondName,
  });
});

export { router };
