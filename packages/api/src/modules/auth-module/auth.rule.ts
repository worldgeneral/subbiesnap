import { z } from "zod";

export const authSchema = z.object({
  password: z.string(),
  email: z.string().email(),
});

export const companyAuthId = z.coerce.number();

export const emailSchema = authSchema.omit({
  password: true,
});

export const passwordSchema = authSchema.omit({
  email: true,
});
