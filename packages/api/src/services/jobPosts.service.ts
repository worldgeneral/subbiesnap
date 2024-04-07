import moment from "moment";
import { db } from "../db";
import {
  JobPostsSchema,
  jobsTable,
  type JobPostsSchemaInsert,
} from "../models/jobs.model";
import { and, eq, isNull } from "drizzle-orm";
import { AppError } from "../utils/ExpressError";

export function normalizeJobPost(
  job: JobPostsSchema,
  companyId?: number
): JobPostsSchemaInsert {
  return {
    companyId: job.companyId,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    title: job.title,
    startsAt: job.startsAt,
    endsAt: job.endsAt,
    compensation: job.compensation,
    description: job.description,
    location: job.location,
    fulfilledAt: job.fulfilledAt,
  };
}

export async function getJobPost(jobPostId: number) {
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

export async function getCompanyJobPosts(companyId: number) {
  const jobPosts = await db
    .select()
    .from(jobsTable)
    .where(
      and(
        eq(jobsTable.companyId, companyId),
        isNull(jobsTable.deletedAt),
        isNull(jobsTable.fulfilledAt)
      )
    );
  const normalizedJobs = jobPosts.map((post) => {
    return normalizeJobPost(post);
  });
  return normalizedJobs;
}

export async function getJobPosts(limit: number, offset: number) {
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

export async function createJobPost(jobPostData: JobPostsSchemaInsert) {
  const [jobPost] = await db.insert(jobsTable).values(jobPostData).returning();

  return normalizeJobPost(jobPost);
}

export async function updateJobPost(
  jobPostData: Partial<JobPostsSchemaInsert>,
  jobPostId: number
) {
  const [jobPost] = await db
    .update(jobsTable)
    .set({ updatedAt: moment().toDate(), ...jobPostData })
    .where(eq(jobsTable.id, jobPostId))
    .returning();

  if (!jobPost) {
    throw new AppError("unable to update job post data", 400);
  }

  return normalizeJobPost(jobPost, jobPostId);
}

export async function deleteJobPost(jobPostId: number) {
  const [jobPost] = await db
    .update(jobsTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(jobsTable.id, jobPostId))
    .returning();

  if (!jobPost) {
    throw new AppError("unable to delete job post data", 400);
  }

  return normalizeJobPost(jobPost, jobPostId);
}
