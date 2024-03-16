import { z } from "zod";

export const authSchema = z.object({
  password: z.string(),
  email: z.string().email(),
});
