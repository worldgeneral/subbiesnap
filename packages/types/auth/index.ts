import { userSchema } from "../users";
import { z } from "zod";

export type login = Required<
  Omit<z.infer<typeof userSchema>, "id" | "firstName" | "secondName">
>;

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
