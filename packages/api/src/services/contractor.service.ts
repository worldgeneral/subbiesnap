import {
  ContractorsSchema,
  ContractorsSchemaInsert,
  contractorsAccreditations,
  contractorsTable,
} from "../schemas";
import { db } from "../db";
import { AppError } from "../utils/ExpressError";
import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";

export function normalizeContractor(
  contractors: ContractorsSchema
): ContractorsSchema {
  return {
    id: contractors.id,
    userId: contractors.userId,
    contractorName: contractors.contractorName,
    logo: contractors.logo,
    location: contractors.location,
    profession: contractors.profession,
    yearsExperience: contractors.yearsExperience,
    createdAt: contractors.createdAt,
    updatedAt: contractors.updatedAt,
    deletedAt: contractors.deletedAt,
  };
}

export async function getContractor(contractorId: number) {
  const [contractor] = await db
    .select()
    .from(contractorsTable)
    .where(eq(contractorsTable.id, contractorId));

  if (!contractor) {
    throw new AppError("unable to find company", 404);
  }

  return normalizeContractor(contractor);
}

export async function getContractors(limit: number, offset: number) {
  const contractors = await db
    .select()
    .from(contractorsTable)
    .where(isNull(contractorsTable.deletedAt))
    .limit(limit)
    .offset(offset);

  const normalizedContractors = contractors.map((con) => {
    return normalizeContractor(con);
  });

  return normalizedContractors;
}

export async function registerContractor(
  contractorsData: ContractorsSchemaInsert
) {
  const [contractor] = await db
    .insert(contractorsTable)
    .values(contractorsData)
    .returning();

  return normalizeContractor(contractor);
}
