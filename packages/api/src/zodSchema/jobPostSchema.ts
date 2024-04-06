import { z } from "zod";

export const jobPostsSchema = z.object({
  companyId: z.number(),
  title: z.string(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  compensation: z.string().optional(),
  description: z.string(),
  location: z.string().optional(),
  fulfilledAt: z.date().optional(),
});