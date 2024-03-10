import "dotenv/config";
import express, { NextFunction } from "express";
import { AppError } from "./utils/ExpressError";
import { usersRoutes } from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
app.use(express.json());

app.use(usersRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("page not found", 404));
});

app.use(errorHandler);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
