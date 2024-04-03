import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";

const jobPostsRoutes = Router();

export { jobPostsRoutes };
