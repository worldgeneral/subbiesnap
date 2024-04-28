import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number().positive().lte(100).optional(),
  offset: z.coerce.number().nonnegative().optional(),
});
