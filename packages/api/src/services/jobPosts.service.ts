import { db } from "../db";
import { jobsTable, type JobPostsSchemaInsert } from "../models/jobs.model";

export async function createJobPost(jobPostData: JobPostsSchemaInsert) {
  const [jobPost] = await db.insert(jobsTable).values(jobPostData).returning();

  return jobPost;
}
