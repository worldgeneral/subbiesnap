import { z } from "zod";
import { UserCompanyRole } from "../services/company.service";

export const companySchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  blurb: z.string().optional(),
});

export const addCompanyUserRoleSchema = z.object({
  role: z.nativeEnum(UserCompanyRole),
  email: z.string().email(),
});

export const updateCompanyUserRoleSchema = z.object({
  role: z.nativeEnum(UserCompanyRole),
  userId: z.number(),
});
