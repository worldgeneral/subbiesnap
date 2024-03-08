import "dotenv/config";
import express from "express";

import { usersRoutes } from "./routes/users";
const app = express();
app.use(express.json());

app.use("/users", usersRoutes);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
