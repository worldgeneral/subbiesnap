import { z } from "zod";
import { UserCompanyRole } from "../../constants/company-emuns";

export const companySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullable().optional(),
  blurb: z.string().nullable().optional(),
  avgRating: z.number(),
  timesRated: z.number(),
});

export const createCompanySchema = companySchema.omit({
  id: true,
  avgRating: true,
  timesRated: true,
  logo: true,
});

export const updateCompanySchema = companySchema.omit({
  id: true,
  avgRating: true,
  timesRated: true,
  logo: true,
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
