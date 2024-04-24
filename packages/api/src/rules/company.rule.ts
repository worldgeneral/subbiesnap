import { z } from "zod";
import { UserCompanyRole } from "../utils/magic.numbers";

export const companySchema = z.object({
  id: z.number(),
  ownerId: z.number(),
  name: z.string(),
  logo: z.string().nullable().optional(),
  blurb: z.string().nullable().optional(),
  avgRating: z.number().nullable().optional(),
  timesRated: z.number().nullable().optional(),
});

export const createCompanySchema = companySchema.omit({
  id: true,
  ownerId: true,
});

export const updateCompanySchema = companySchema.omit({
  id: true,
  ownerId: true,
});

export const companyUserSchema = z.object({
  id: z.number(),
  userId: z.number(),
  role: z.nativeEnum(UserCompanyRole),
});

export const createCompanyUserSchema = z.object({
  role: z.nativeEnum(UserCompanyRole),
  email: z.string().email(),
});

export const updateCompanyUserSchema = companyUserSchema.omit({
  id: true,
  userId: true,
});
