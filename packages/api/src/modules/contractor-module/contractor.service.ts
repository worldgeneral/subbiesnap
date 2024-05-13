import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";
import z from "zod";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import {
  ContractorsAccreditationsSchema,
  ContractorsAccreditationsSchemaInsert,
  ContractorsSchema,
  ContractorsSchemaInsert,
  contractorsAccreditations,
  contractorsTable,
} from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import {
  DeleteType,
  softDeletesHandler,
} from "../soft-delete-module/soft-deletes/soft-delete.service";
import {
  ContractorsAccreditationSchema,
  contractorSchema,
} from "./contractor.rule";

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
    throw new AppError("unable to find contractor", HttpStatus.NotFound);
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
  contractorId: number,
  userId: number
): Promise<Contractor> {
  const [contractor] = await db
    .update(contractorsTable)
    .set({ updatedAt: moment().toDate(), ...contractorsData })
    .where(eq(contractorsTable.id, contractorId))
    .returning();

  if (!contractor) {
    throw new AppError("unable to update contractor", HttpStatus.BadRequest);
  }

  return normalizeContractor(contractor);
}

export async function deleteContractor(
  contractorId: number
): Promise<Contractor> {
  const result = await softDeletesHandler<[{ contractor: Contractor }]>([
    contractorId ? [DeleteType.Contractor, { contractorId }] : null,
    contractorId
      ? [DeleteType.ContractorAccreditation, { contractorId }]
      : null,

    contractorId ? [DeleteType.Rating, { contractorId }] : null,
  ]);

  return result[0].contractor;
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
    throw new AppError("unable to find Accreditation", HttpStatus.NotFound);
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
    throw new AppError("unable to find Accreditations", HttpStatus.NotFound);
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
    throw new AppError(
      "Error unable to add accreditation",
      HttpStatus.BadRequest
    );
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
    throw new AppError(
      "Error unable to update accreditation",
      HttpStatus.BadRequest
    );
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
    throw new AppError("unable to update accreditation", HttpStatus.BadRequest);
  }

  return normalizeAccreditation(accreditation);
}

export async function deleteAccreditation(
  accreditationId: number
): Promise<ContractorsAccreditation> {
  const result = await softDeletesHandler<
    [{ contractorsAccreditations: ContractorsAccreditation }]
  >([
    accreditationId
      ? [DeleteType.ContractorAccreditation, { accreditationId }]
      : null,
  ]);

  return result[0].contractorsAccreditations;
}
