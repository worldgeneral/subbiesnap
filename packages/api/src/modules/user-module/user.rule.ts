import { z } from "zod";

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
    password: z.string().min(8),
    confirmPassword: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    secondName: z.string(),
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
    if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
      });
    }
  });
