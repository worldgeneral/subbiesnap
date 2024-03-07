import "dotenv/config";
import express from "express";

const usersRoutes = require("./routes/users");
const app = express();

app.use("/subbiesite", usersRoutes);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
