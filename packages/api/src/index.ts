import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { HttpStatus } from "@subbiesnap/constants";
import { errorHandler } from "./errors/error-handler.middleware";
import { AppError } from "./errors/express-error";
import { authRoutes } from "./modules/auth-module/auth.router";
import { companiesRoutes } from "./modules/company-module/companies.router";
import { contractorsRoutes } from "./modules/contractor-module/contractors.router";
import { jobsRoutes } from "./modules/job-module/jobs.router";
import { ratingsRoutes } from "./modules/rating-module/ratings.router";
import { usersRoutes } from "./modules/user-module/users.router";

import { env } from "./env";

const app = express();

async function main() {
  app.use(express.json());
  app.use(cookieParser());

  app.use(usersRoutes);
  app.use(authRoutes);
  app.use(companiesRoutes);
  app.use(contractorsRoutes);
  app.use(jobsRoutes);
  app.use(ratingsRoutes);

  app.all("*", (req, res, next) => {
    console.log(req.path);
    next(new AppError("page not found", HttpStatus.NotFound));
  });

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`http://localhost:${env.PORT}`);
  });
}

main();
