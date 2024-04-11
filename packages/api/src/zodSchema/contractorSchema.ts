import { z } from "zod";

export const getContractorSchema = z.object({
  limit: z.number(),
  offset: z.number(),
});
