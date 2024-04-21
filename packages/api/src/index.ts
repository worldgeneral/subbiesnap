import "dotenv/config";
import express, { NextFunction } from "express";
import { AppError } from "./utils/express.error";
import { usersRoutes } from "./routes/users.router";
import { errorHandler } from "./middleware/error-handler.middleware";
import { authRoutes } from "./routes/auth.router";
import cookieParser from "cookie-parser";
import { companiesRoutes } from "./routes/companies.router";
import { contractorsRoutes } from "./routes/contractor.router";
import { jobsRoutes } from "./routes/jobs.router";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(usersRoutes);
app.use(authRoutes);
app.use(companiesRoutes);
app.use(contractorsRoutes);
app.use(jobsRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("page not found", 404));
});

app.use(errorHandler);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
