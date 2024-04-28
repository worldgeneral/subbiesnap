import {
  ContractorsAccreditationsSchema,
  ContractorsAccreditationsSchemaInsert,
  ContractorsSchema,
  ContractorsSchemaInsert,
  contractorsAccreditations,
  contractorsTable,
} from "../schemas";
import { db } from "../db";
import { AppError } from "../utils/express.error";
import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";
import z from "zod";
import {
  ContractorsAccreditationSchema,
  contractorSchema,
} from "../rules/contractor.rule";

export type Contractor = Required<z.infer<typeof contractorSchema>>;

export type ContractorsAccreditation = Required<
  z.infer<typeof ContractorsAccreditationSchema>
>;

export function normalizeContractor(
  contractors: ContractorsSchema
): Contractor {
  return {
    id: contractors.id,
    userId: contractors.userId,
    name: contractors.name,
    logo: contractors.logo,
    location: contractors.location,
    profession: contractors.profession,
    yearsExperience: contractors.yearsExperience,
    avgRating: contractors.avgRating,
    timesRated: contractors.timesRated,
  };
}

export function normalizeAccreditation(
  accreditation: ContractorsAccreditationsSchema
): ContractorsAccreditation {
  return {
    id: accreditation.id,
    contractorId: accreditation.contractorId,
    name: accreditation.name,
    accreditation: accreditation.accreditation,
  };
}

export async function getContractor(contractorId: number) {
  const [contractor] = await db
    .select()
    .from(contractorsTable)
    .where(
      and(
        eq(contractorsTable.id, contractorId),
        isNull(contractorsTable.deletedAt)
      )
    );

  if (!contractor) {
    throw new AppError("unable to find contractor", 404);
  }

  return normalizeContractor(contractor);
}

export async function getContractors(
  limit: number = 25,
  offset: number = 0
): Promise<Array<Contractor>> {
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
  contractorsData: Omit<ContractorsSchemaInsert, "avgRating" | "timesRated">,
  userId: number
): Promise<Contractor> {
  const [contractor] = await db
    .insert(contractorsTable)
    .values({ ...contractorsData, userId: userId })
    .returning();

  return normalizeContractor(contractor);
}

export async function updateContractor(
  contractorsData: Partial<Omit<ContractorsSchemaInsert, "userId">>,
  contractorId: number
): Promise<Contractor> {
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

export async function deleteContractor(
  contractorId: number
): Promise<Contractor> {
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

export async function getAccreditation(
  accreditationsId: number
): Promise<ContractorsAccreditation> {
  const [contractorsAccreditation] = await db
    .select()
    .from(contractorsAccreditations)
    .where(
      and(
        isNull(contractorsAccreditations.deletedAt),
        eq(contractorsAccreditations.id, accreditationsId)
      )
    );

  if (!contractorsAccreditation) {
    throw new AppError("unable to find Accreditation", 404);
  }

  return normalizeAccreditation(contractorsAccreditation);
}

export async function getAccreditations(
  contractorId: number,
  limit: number = 25,
  offset: number = 0
): Promise<Array<ContractorsAccreditation>> {
  const contractorsAccreditation = await db
    .select()
    .from(contractorsAccreditations)
    .where(
      and(
        isNull(contractorsAccreditations.deletedAt),
        eq(contractorsAccreditations.contractorId, contractorId)
      )
    )
    .limit(limit)
    .offset(offset);

  if (!contractorsAccreditation) {
    throw new AppError("unable to find Accreditations", 404);
  }
  const accreditations = contractorsAccreditation.map((accreditation) =>
    normalizeAccreditation(accreditation)
  );
  return accreditations;
}

export async function addAccreditations(
  accreditationData: Array<
    Omit<ContractorsAccreditationsSchemaInsert, "contractorId">
  >,
  contractorId: number,
  userId: number
): Promise<Array<ContractorsAccreditation>> {
  const [contractor] = await db
    .select()
    .from(contractorsTable)
    .where(eq(contractorsTable.userId, userId));

  if (contractor.id !== contractorId) {
    throw new AppError("Error unable to add accreditation", 400);
  }

  const accreditationWithID = accreditationData.map((accreditation) => ({
    ...accreditation,
    contractorId: contractorId,
  }));

  const contractorsAccreditation = await db
    .insert(contractorsAccreditations)
    .values(accreditationWithID)
    .returning();

  const accreditations = contractorsAccreditation.map((accreditation) =>
    normalizeAccreditation(accreditation)
  );

  return accreditations;
}

export async function updateAccreditation(
  accreditationData: Partial<ContractorsAccreditationsSchemaInsert>,
  accreditationId: number,
  contractorId: number,
  userId: number
): Promise<ContractorsAccreditation> {
  const [contractor] = await db
    .select()
    .from(contractorsTable)
    .where(eq(contractorsTable.userId, userId));

  if (contractor.id !== contractorId) {
    throw new AppError("Error unable to update accreditation", 400);
  }
  const [accreditation] = await db
    .update(contractorsAccreditations)
    .set({ updatedAt: moment().toDate(), ...accreditationData })
    .where(
      and(
        eq(contractorsAccreditations.id, accreditationId),
        eq(contractorsAccreditations.contractorId, contractorId),
        isNull(contractorsAccreditations.deletedAt)
      )
    )
    .returning();

  if (!accreditation) {
    throw new AppError("unable to update accreditation", 400);
  }

  return normalizeAccreditation(accreditation);
}

export async function deleteAccreditation(
  accreditationId: number,
  contractorId: number,
  userId: number
): Promise<ContractorsAccreditation> {
  const [contractor] = await db
    .select()
    .from(contractorsTable)
    .where(eq(contractorsTable.userId, userId));

  if (contractor.id !== contractorId) {
    throw new AppError(
      "Error user does not have permission to update accreditation",
      403
    );
  }

  const [accreditation] = await db
    .update(contractorsAccreditations)
    .set({ deletedAt: moment().toDate() })
    .where(
      and(
        eq(contractorsAccreditations.id, accreditationId),
        eq(contractorsAccreditations.contractorId, contractorId)
      )
    )
    .returning();

  if (!accreditation) {
    throw new AppError("Error unable to delete accreditation", 400);
  }

  return normalizeAccreditation(accreditation);
}
