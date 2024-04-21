import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { sessionAuth } from "../middleware/session-auth.middleware";
import { paginationSchema } from "../rules/pagination.rule";

const ratingsRoutes = Router();

export { ratingsRoutes };
