import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";
import z from "zod";
import { db } from "../../db/db";
import { AppError } from "../../errors/express-error";
import {
  DeleteType,
  softDeletesHandler,
} from "../soft-delete-module/soft-deletes/soft-delete.service";
import {
  JobPostsSchema,
  jobsTable,
  type JobPostsSchemaInsert,
} from "./job.model";
import { jobPostsSchema } from "./jobPost.rule";

export type Job = Required<z.infer<typeof jobPostsSchema>>;

export function normalizeJobPost(job: JobPostsSchema): Job {
  return {
    id: job.id,
    companyId: job.companyId,
    title: job.title,
    startsAt: job.startsAt,
    endsAt: job.endsAt,
    compensationValueMin: job.compensationValueMin,
    compensationValueMax: job.compensationValueMax,
    compensationSuffix: job.compensationSuffix,
    description: job.description,
    location: job.location,
    fulfilledAt: job.fulfilledAt,
  };
}

export async function getJobPost(jobPostId: number): Promise<Job> {
  const [jobPost] = await db
    .select()
    .from(jobsTable)
    .where(
      and(
        eq(jobsTable.id, jobPostId),
        isNull(jobsTable.deletedAt),
        isNull(jobsTable.fulfilledAt)
      )
    );
  if (!jobPost) {
    throw new AppError("Error unable to find job", 400);
  }

  return normalizeJobPost(jobPost);
}

export async function getCompanyJobPosts(
  companyId: number,
  limit: number = 25,
  offset: number = 0
): Promise<Array<Job>> {
  const jobPosts = await db
    .select()
    .from(jobsTable)
    .where(
      and(
        eq(jobsTable.companyId, companyId),
        isNull(jobsTable.deletedAt),
        isNull(jobsTable.fulfilledAt)
      )
    )
    .limit(limit)
    .offset(offset);
  const normalizedJobs = jobPosts.map((post) => {
    return normalizeJobPost(post);
  });
  return normalizedJobs;
}

export async function getJobPosts(
  limit: number = 25,
  offset: number = 0
): Promise<Array<Job>> {
  const jobPosts = await db
    .select()
    .from(jobsTable)
    .where(and(isNull(jobsTable.deletedAt), isNull(jobsTable.fulfilledAt)))
    .limit(limit)
    .offset(offset);

  const normalizedJobs = jobPosts.map((post) => {
    return normalizeJobPost(post);
  });

  return normalizedJobs;
}

export async function createJobPost(
  jobPostData: Omit<JobPostsSchemaInsert, "companyId">,
  companyId: number
): Promise<Job> {
  const [jobPost] = await db
    .insert(jobsTable)
    .values({ ...jobPostData, companyId: companyId })
    .returning();

  return normalizeJobPost(jobPost);
}

export async function updateJobPost(
  jobPostData: Partial<JobPostsSchemaInsert>,
  jobPostId: number,
  companyId: number
): Promise<Job> {
  const [jobPost] = await db
    .update(jobsTable)
    .set({ updatedAt: moment().toDate(), companyId: companyId, ...jobPostData })
    .where(eq(jobsTable.id, jobPostId))
    .returning();

  if (!jobPost) {
    throw new AppError("unable to update job post data", 400);
  }

  return normalizeJobPost(jobPost);
}

export async function deleteJobPost(jobId: number): Promise<Job> {
  const result = await softDeletesHandler<[{ jobs: Job }]>([
    jobId ? [DeleteType.Job, { jobId }] : null,
  ]);

  return result[0].jobs;
}
