import { z } from "zod";

export type Contractor = Required<z.infer<typeof contractorSchema>>;

export type ContractorsAccreditation = Required<
  z.infer<typeof ContractorsAccreditationSchema>
>;

export const contractorSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  profession: z.string(),
  yearsExperience: z.number().nonnegative(),
  avgRating: z.number(),
  timesRated: z.number(),
});

export const CreateContractorSchema = contractorSchema.omit({
  id: true,
  userId: true,
  avgRating: true,
  timesRated: true,
  logo: true,
});

export const UpdateContractorSchema = contractorSchema
  .omit({
    id: true,
    userId: true,
    avgRating: true,
    timesRated: true,
    logo: true,
  })
  .partial();

// for single objects
export const ContractorsAccreditationSchema = z.object({
  id: z.number(),
  contractorId: z.number(),
  name: z.string(),
  accreditation: z.string(),
});
//for array of objects
export const ContractorsAccreditationsSchema = z.array(
  ContractorsAccreditationSchema.omit({
    id: true,
    contractorId: true,
  })
);

export const CreateContractorsAccreditationSchema =
  ContractorsAccreditationSchema.omit({
    id: true,
    contractorId: true,
  }).partial();

export const UpdateContractorsAccreditationSchema =
  ContractorsAccreditationSchema.omit({
    id: true,
    contractorId: true,
  }).partial();
