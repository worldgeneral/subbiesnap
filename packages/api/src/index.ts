import "dotenv/config";
import express from "express";
import { db } from "./db";
import { users } from "./schema";
const app = express();

app.get("/", async (req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});
app.listen(3001, () => {
  console.log("http://localhost:3001");
});
