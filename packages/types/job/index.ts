import { z } from "zod";

export const JobSchema = z.object({
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

export type Job = Required<z.infer<typeof JobSchema>>;

export const CreateJobSchema = JobSchema.omit({
  id: true,
  companyId: true,
});

export const UpdateJobSchema = JobSchema.omit({
  id: true,
  companyId: true,
});
