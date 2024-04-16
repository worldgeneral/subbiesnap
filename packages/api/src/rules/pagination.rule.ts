import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number(),
  offset: z.coerce.number(),
});
