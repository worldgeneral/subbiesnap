import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { sessionAuth } from "../middleware/session.auth";
import { companyAuth } from "../middleware/company.auth";
import {
  CreateJobPostSchema,
  updateJobPostSchema,
} from "../rules/jobPost.rule";
import {
  createJobPost,
  deleteJobPost,
  getCompanyJobPosts,
  getJobPost,
  getJobPosts,
  updateJobPost,
} from "../services/jobPosts.service";
import { paginationSchema } from "../rules/pagination.rule";
import { UserCompanyRole } from "../utils/magic.numbers";

const jobsRoutes = Router();

jobsRoutes.get(
  "/jobs",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const pagination = paginationSchema.parse(req.query);
    const jobPosts = await getJobPosts(pagination.limit, pagination.offset);
    res.json(jobPosts);
  })
);

jobsRoutes.get(
  "/company/:companyId/jobs",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const pagination = paginationSchema.parse(req.query);
    const jobPosts = await getCompanyJobPosts(
      companyId,
      pagination.limit,
      pagination.offset
    );
    res.json(jobPosts);
  })
);

jobsRoutes.get(
  "/jobs/:jobId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const jobPostId = Number(req.params.jobId);
    const jobPost = await getJobPost(jobPostId);
    res.json(jobPost);
  })
);

jobsRoutes.post(
  "/company/:companyId/jobs",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = CreateJobPostSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const newJobPost = await createJobPost(data, companyId);
    res.json(newJobPost).status(201);
  })
);

jobsRoutes.patch(
  "/company/:companyId/jobs/:jobId",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = updateJobPostSchema.parse(req.body);
    const jobPostId = Number(req.params.jobId);
    const companyId = Number(req.params.companyId);
    const updatedJobPost = await updateJobPost(data, jobPostId, companyId);
    res.json(updatedJobPost);
  })
);

jobsRoutes.delete(
  "/company/:companyId/jobs/:jobId",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const jobPostId = Number(req.params.jobId);
    const deletedJobPost = await deleteJobPost(jobPostId);
    res.json(deletedJobPost);
  })
);

export { jobsRoutes };
