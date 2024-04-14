import { z } from "zod";

export const getContractorSchema = z.object({
  limit: z.number(),
  offset: z.number(),
});

export const contractorSchema = z.object({
  userId: z.number(),
  contractorName: z.string().optional(),
  logo: z.string().optional(),
  location: z.string().optional(),
  profession: z.string(),
  yearsExperience: z.number(),
});
//for array of objects
export const ContractorsAccreditationsSchema = z.array(
  z.object({
    contractorId: z.number(),
    accreditationName: z.string(),
    accreditation: z.string(),
  })
);
// for single objects
export const ContractorsAccreditationSchema = z.object({
  contractorId: z.number(),
  accreditationName: z.string(),
  accreditation: z.string(),
});
