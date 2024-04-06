import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { companyAuth } from "../middleware/companyAuth";
import { UserCompanyRole } from "../services/company.service";
import { jobPostsSchema } from "../zodSchema/jobPostSchema";
import { createJobPost } from "../services/jobPosts.service";

const jobPostsRoutes = Router();

jobPostsRoutes.post(
  "/company/:companyId/jobs",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = jobPostsSchema.parse(req.body);
    const newJobPost = await createJobPost(data);
    res.json(newJobPost);
  })
);

export { jobPostsRoutes };
