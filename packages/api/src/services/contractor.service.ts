import {
  ContractorsAccreditationsSchema,
  ContractorsAccreditationsSchemaInsert,
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

export function normalizeAccreditation(
  accreditation: ContractorsAccreditationsSchema
): ContractorsAccreditationsSchema {
  return {
    id: accreditation.id,
    contractorId: accreditation.contractorId,
    accreditationName: accreditation.accreditationName,
    accreditation: accreditation.accreditation,
    createdAt: accreditation.createdAt,
    updatedAt: accreditation.updatedAt,
    deletedAt: accreditation.deletedAt,
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

export async function updateContractor(
  contractorsData: Partial<ContractorsSchemaInsert>,
  contractorId: number
) {
  const [contractor] = await db
    .update(contractorsTable)
    .set({ updatedAt: moment().toDate(), ...contractorsData })
    .where(eq(contractorsTable.id, contractorId))
    .returning();

  if (!contractor) {
    throw new AppError("unable to update contractor", 400);
  }

  return normalizeContractor(contractor);
}

export async function deleteContractor(contractorId: number) {
  const [contractor] = await db
    .update(contractorsTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(contractorsTable.id, contractorId))
    .returning();

  if (!contractor) {
    throw new AppError("unable to delete contractor", 400);
  }

  return normalizeContractor(contractor);
}

export async function getAccreditation(accreditationId: number) {
  const [contractorsAccreditation] = await db
    .select()
    .from(contractorsAccreditations)
    .where(eq(contractorsAccreditations.id, accreditationId));

  if (!contractorsAccreditation) {
    throw new AppError("unable to find Accreditation", 404);
  }

  return normalizeAccreditation(contractorsAccreditation);
}

export async function addAccreditations(
  accreditationData: Array<ContractorsAccreditationsSchemaInsert>
) {
  const accreditations = accreditationData.forEach(async (accreditation) => {
    const [contractorsAccreditation] = await db
      .insert(contractorsAccreditations)
      .values(accreditation)
      .returning();

    return normalizeAccreditation(contractorsAccreditation);
  });

  return accreditations;
}

export async function updateAccreditation(
  accreditationData: Partial<ContractorsAccreditationsSchemaInsert>,
  accreditationId: number
) {
  const [accreditation] = await db
    .update(contractorsAccreditations)
    .set({ updatedAt: moment().toDate(), ...accreditationData })
    .where(eq(contractorsAccreditations.id, accreditationId))
    .returning();

  if (!accreditation) {
    throw new AppError("unable to update accreditation", 400);
  }

  return normalizeAccreditation(accreditation);
}

export async function deleteAccreditation(accreditationId: number) {
  const [accreditation] = await db
    .update(contractorsTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(contractorsAccreditations.id, accreditationId))
    .returning();

  if (!accreditation) {
    throw new AppError("unable to delete accreditation", 400);
  }

  return normalizeContractor(accreditation);
}
