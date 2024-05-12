import { z } from "zod";

export const jobPostsSchema = z.object({
  id: z.number(),
  companyId: z.coerce.number(),
  title: z.string(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().nullable().optional(),
  compensationValueMin: z.number().nullable().optional(),
  compensationValueMax: z.number().nullable().optional(),
  compensationSuffix: z.string().nullable().optional(),
  description: z.string(),
  location: z.string().nullable().optional(),
  fulfilledAt: z.coerce.date().nullable().optional(),
});

export const CreateJobPostSchema = jobPostsSchema.omit({
  id: true,
  companyId: true,
});

export const updateJobPostSchema = jobPostsSchema.omit({
  id: true,
  companyId: true,
});
