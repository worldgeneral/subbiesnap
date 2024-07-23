import { Request, Router } from "express";
import { UserCompanyRole } from "../../constants/company-emuns";
import { HttpStatus } from "../../constants/https";
import { tryCatch } from "../../errors/try-catch";
import { paginationSchema } from "../../rules/pagination.rule";
import { sessionAuth } from "../auth-module/session-auth.middleware";
import { companyAuth } from "../company-module/company-auth.middleware";
import { CreateJobSchema, UpdateJobSchema } from "@subbiesnap/types/job";
import {
  createJobPost,
  deleteJobPost,
  getCompanyJobPosts,
  getJobPost,
  getJobPosts,
  updateJobPost,
} from "./jobPost.service";

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
    const data = CreateJobSchema.parse(req.body);
    const companyId = Number(req.params.companyId);
    const newJobPost = await createJobPost(data, companyId);
    res.json(newJobPost).status(HttpStatus.Created);
  })
);

jobsRoutes.patch(
  "/company/:companyId/jobs/:jobId",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = UpdateJobSchema.parse(req.body);
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
