import { z } from "zod";
import {
  MIN_AMOUNT_OF_LOWER_CASE,
  MIN_AMOUNT_OF_NUMBERS,
  MIN_AMOUNT_OF_UPPER_CASE,
  PASSWORD_MIN_LENGTH,
} from "@subbiesnap/constants/user-signup-values";

export type User = Required<Omit<z.infer<typeof userSchema>, "password">>;

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  secondName: z.string(),
});

export const updateUserSchema = userSchema.omit({
  id: true,
  password: true,
  email: true,
});

export const registerSchema = z
  .object({
    password: z.string().min(PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
    email: z.string().email(),
    firstName: z.string().min(2),
    secondName: z.string().min(2),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
    }
    if (
      countOfLowerCase < MIN_AMOUNT_OF_LOWER_CASE ||
      countOfUpperCase < MIN_AMOUNT_OF_UPPER_CASE ||
      countOfNumbers < MIN_AMOUNT_OF_NUMBERS
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
        path: ["password"],
      });
    }
  });
