import { z } from "zod";

export const authSchema = z.object({
  password: z.string().min(8),
  email: z.string().email(),
});
