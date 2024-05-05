import { db } from "../../db";
import {
  CompaniesSchemaInsert,
  CompaniesUsersSchema,
  CompaniesUsersSchemaInsert,
  JobPostsSchemaInsert,
  RateableType,
  SessionsSchema,
  UserSchema,
  UserSchemaInsert,
  companiesTable,
  companiesUsersTable,
  contractorsAccreditations,
  contractorsTable,
  jobsTable,
  ratingsTable,
  ratingsTableSchemaInsert,
  sessionsTable,
  usersTable,
} from "../../schemas";
import { AppError } from "../../utils/express.error";
import { and, arrayOverlaps, eq, inArray, isNull, or } from "drizzle-orm";
import moment from "moment";
import { User, normalizeUser } from "../user.service";
import * as argon2 from "argon2";
import {
  Contractor,
  ContractorsAccreditation,
  normalizeAccreditation,
  normalizeContractor,
} from "../contractor.service";
import { normalizeCompany, normalizeCompanyUser } from "../company.service";
import { normalizeJobPost } from "../jobPost.service";
import { normalizeRating } from "../rating.service";
import { CompanyStatus, UserCompanyRole } from "../../utils/magic.numbers";

type InputData = Array<
  | null
  | [DeleteType.User, { userId: number }]
  | [
      DeleteType.Session,
      (
        | { sessionToken: string; userId?: never }
        | { sessionToken?: never; userId: number }
      ),
    ]
  | [DeleteType.Contractor, { userId: number }]
  | [
      DeleteType.ContractorAccreditation,
      (
        | {
            contractorAccreditationId: number;
            contractorId?: never;
          }
        | {
            contractorAccreditationId?: never;
            contractorId: number;
          }
      ),
    ]
  | [
      DeleteType.Company,
      (
        | { companyId: number; userId?: never }
        | { companyId?: never; userId: number }
      ),
    ]
  | [
      DeleteType.CompanyUser,
      (
        | { companyId: number; userId: number }
        | { companyId: number; userId?: never }
        | { companyId?: never; userId: number }
      ),
    ]
  | [
      DeleteType.Job,
      (
        | { jobId: number; companyId?: never }
        | { jobId?: never; companyId: Array<number> }
        | { jobId?: never; companyId: number }
      ),
    ]
  | [
      DeleteType.Rating,
      (
        | {
            ratableType: RateableType.Companies;
            RatableId: number;
            userId?: never;
          }
        | {
            ratableType?: never;
            RatableId?: never;
            userId: number;
          }
      ),
    ]
>;

export enum DeleteType {
  User = "user",
  Session = "session",
  Company = "company",
  CompanyUser = "company-user",
  Contractor = "contractor",
  ContractorAccreditation = "contractor-accreditation",
  Job = "job",
  Rating = "rating",
}

export async function softDeletesHandler(inputData: InputData) {
  let promises = [];
  for (let i = 0; i < inputData.length; i++) {
    let row = inputData[i];

    if (row === null) {
      continue;
    }
    switch (row[0]) {
      case DeleteType.User:
        promises.push({ user: deleteUser(row[1]) });
        break;

      case DeleteType.Session:
        promises.push({ sessions: deleteSession(row[1]) });
        break;
      case DeleteType.Contractor:
        promises.push({ contractor: deleteContractor(row[1]) });
        break;
      case DeleteType.ContractorAccreditation:
        promises.push({
          contractorsAccreditations: deleteContractorAccreditations(row[1]),
        });
        break;
      case DeleteType.Company:
        promises.push({ companies: deleteCompany(row[1]) });
        break;
      case DeleteType.CompanyUser:
        promises.push({ companyRoles: deleteCompanyUsers(row[1]) });
        break;
      case DeleteType.Job:
        promises.push({ jobs: deleteJob(row[1]) });

        break;
      case DeleteType.Rating:
        promises.push({ ratings: deleteRating(row[1]) });
        break;
    }
  }

  return await Promise.all(promises);
}

export async function deleteUser(data: {
  userId?: number;
  null?: null;
}): Promise<User | undefined> {
  if (data.null) {
    return;
  }
  const [deletedUser] = await db
    .update(usersTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(usersTable.id, data.userId!))
    .returning();

  if (!deletedUser) {
    throw new AppError("Error unable to delete user", 500);
  }

  return { ...normalizeUser(deletedUser) };
}

export async function deleteSession(data: {
  userId?: number;
  sessionToken?: string;
  null?: null;
}): Promise<Array<SessionsSchema> | SessionsSchema | undefined> {
  if (data.null) {
    return;
  }
  if (data.sessionToken) {
    const hashedToken = await argon2.hash(data.sessionToken);

    const [token] = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.sessionToken, hashedToken))
      .returning();

    if (!token) {
      throw new AppError("Error unable to delete session", 500);
    }
    return token;
  }
  const tokens = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.userId, data.userId!))
    .returning();

  if (!tokens) {
    throw new AppError("Error unable to delete session", 500);
  }
  return tokens.map((token) => {
    return token;
  });
}
export async function deleteContractor(data: {
  userId?: number;
  null?: null;
}): Promise<Contractor | undefined> {
  if (data.null) {
    return;
  }
  const [deletedContractor] = await db
    .update(contractorsTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(contractorsTable.userId, data.userId!))
    .returning();

  if (!deletedContractor) {
    throw new AppError("Error unable to delete contractor", 500);
  }

  return normalizeContractor(deletedContractor);
}

export async function deleteContractorAccreditations(data: {
  contractorId?: number;
  accreditationId?: number;
  null?: null;
}): Promise<
  Array<ContractorsAccreditation> | ContractorsAccreditation | undefined
> {
  if (data.null) {
    return;
  }
  if (data.accreditationId) {
    const [deletedAccreditation] = await db
      .update(contractorsAccreditations)
      .set({ deletedAt: moment().toDate() })
      .where(eq(contractorsAccreditations.id, data.accreditationId))
      .returning();

    if (!deletedAccreditation) {
      throw new AppError("Error unable to delete accreditation", 500);
    }
    return normalizeAccreditation(deletedAccreditation);
  }
  const deletedAccreditations = await db
    .update(contractorsAccreditations)
    .set({ deletedAt: moment().toDate() })
    .where(eq(contractorsAccreditations.contractorId, data.contractorId!))
    .returning();

  if (!deletedAccreditations) {
    throw new AppError(
      "Error unable to delete contractors accreditations",
      500
    );
  }

  return deletedAccreditations.map(normalizeAccreditation);
}

export async function deleteCompany(data: {
  companyId?: number;
  userId?: number;
  null?: null;
}): Promise<Array<CompaniesSchemaInsert> | CompaniesSchemaInsert | undefined> {
  if (data.null) {
    return;
  }
  if (data.companyId) {
    const [deletedCompany] = await db
      .update(companiesTable)
      .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
      .where(eq(companiesTable.id, data.companyId!))
      .returning();

    if (!deletedCompany) {
      throw new AppError("Error unable to delete company", 500);
    }

    return normalizeCompany(deletedCompany);
  }

  const [usersCompanies] = await db
    .select({ companyId: companiesUsersTable.companyId })
    .from(companiesUsersTable)
    .where(eq(companiesUsersTable.userId, data.userId!));

  const deletedCompanies = await db
    .update(companiesTable)
    .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
    .where(eq(companiesTable.id, usersCompanies.companyId))
    .returning();

  if (!deletedCompanies) {
    throw new AppError("Error unable to delete companies", 500);
  }
  return deletedCompanies.map(normalizeCompany);
}

export async function deleteCompanyUsers(data: {
  companyId?: number;
  userId?: number;
  null?: null;
}): Promise<
  | Array<Omit<CompaniesUsersSchema, "deletedAt" | "companyId">>
  | Omit<CompaniesUsersSchema, "deletedAt" | "companyId">
  | undefined
> {
  if (data.null) {
    return;
  }
  if (data.userId && data.companyId) {
    const [deletedCompanyUser] = await db
      .update(companiesUsersTable)
      .set({ deletedAt: moment().toDate() })
      .where(
        and(
          eq(companiesUsersTable.companyId, data.companyId),
          eq(companiesUsersTable.userId, data.userId)
        )
      )
      .returning();

    if (!deletedCompanyUser) {
      throw new AppError("Error unable to delete company user", 500);
    }

    return normalizeCompanyUser(deletedCompanyUser);
  }

  if (data.companyId) {
    const deletedCompanyUsers = await db
      .update(companiesUsersTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(companiesUsersTable.companyId, data.companyId))
      .returning();

    if (!deletedCompanyUsers) {
      throw new AppError("Error unable to delete company users", 500);
    }

    return deletedCompanyUsers.map(normalizeCompanyUser);
  }

  const deletedCompanyUsers = await db
    .update(companiesUsersTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(companiesUsersTable.userId, data.userId!))
    .returning();

  if (!deletedCompanyUsers) {
    throw new AppError("Error unable to delete company users", 500);
  }

  return deletedCompanyUsers.map(normalizeCompanyUser);
}

export async function deleteJob(data: {
  companyId?: number | Array<number>;
  jobId?: number;
}): Promise<Array<JobPostsSchemaInsert> | JobPostsSchemaInsert | undefined> {
  if (data.companyId === null) {
    return;
  }
  if (data.jobId) {
    const [deletedJob] = await db
      .update(jobsTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(jobsTable.id, data.jobId))
      .returning();

    if (!deletedJob) {
      throw new AppError("Error unable to delete job post", 500);
    }

    return normalizeJobPost(deletedJob);
  }

  const deletedJobs = await db
    .update(jobsTable)
    .set({ deletedAt: moment().toDate() })
    .where(
      inArray(
        jobsTable.companyId,
        Array.isArray(data.companyId) ? data.companyId! : [data.companyId!]
      )
    )
    .returning();

  if (!deletedJobs) {
    throw new AppError("Error unable to delete job posts", 500);
  }

  return deletedJobs.map(normalizeJobPost);
}

export async function deleteRating(data: {
  userId?: number;
  ratingId?: number;
  null?: null;
}): Promise<
  Array<ratingsTableSchemaInsert> | ratingsTableSchemaInsert | undefined
> {
  if (data.null) {
    return;
  }
  if (data.ratingId) {
    const [deletedRating] = await db
      .update(ratingsTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(ratingsTable.id, data.ratingId))
      .returning();

    if (!deletedRating) {
      throw new AppError("Error unable to delete rating", 500);
    }

    return normalizeRating(deletedRating);
  }

  const deletedRatings = await db
    .update(ratingsTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(ratingsTable.userId, data.userId!))
    .returning();

  if (!deletedRatings) {
    throw new AppError("Error unable to delete ratings", 500);
  }

  return deletedRatings.map(normalizeRating);
}
