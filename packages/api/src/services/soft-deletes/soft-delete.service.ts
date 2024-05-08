import { db } from "../../db";
import {
  JobPostsSchemaInsert,
  RateableType,
  SessionsSchema,
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
import { and, eq, inArray, ne, or } from "drizzle-orm";
import moment from "moment";
import { User, normalizeUser } from "../user.service";
import * as argon2 from "argon2";
import {
  Contractor,
  ContractorsAccreditation,
  normalizeAccreditation,
  normalizeContractor,
} from "../contractor.service";
import {
  Company,
  CompanyUser,
  normalizeCompany,
  normalizeCompanyUser,
} from "../company.service";
import { normalizeJobPost } from "../jobPost.service";
import { normalizeRating } from "../rating.service";
import { CompanyStatus, UserCompanyRole } from "../../utils/magic.numbers";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";
import { ExtractTablesWithRelations } from "drizzle-orm";

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
  | [DeleteType.Contractor, { userId: number } | { contractorId: number }]
  | [
      DeleteType.ContractorAccreditation,
      (
        | {
            accreditationId: number;
            contractorId?: never;
          }
        | {
            accreditationId?: never;
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
            companyId: number;
            contractorId?: never;
            userId?: never;
            ratingId?: never;
          }
        | {
            companyId?: never;
            contractorId: number;
            userId?: never;
            ratingId?: never;
          }
        | {
            companyId?: never;
            contractorId?: never;
            userId: number;
            ratingId?: never;
          }
        | {
            companyId?: never;
            contractorId?: never;
            userId?: never;
            ratingId: number;
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

type TransactionType = PgTransaction<
  NeonHttpQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export async function softDeletesHandler<T extends unknown[] = unknown[]>(
  inputData: InputData
): Promise<T> {
  const transactionData = await db.transaction(async (tx) => {
    const options = { tx };
    let data = [];
    for (let i = 0; i < inputData.length; i++) {
      let row = inputData[i];

      if (row === null) {
        continue;
      }
      switch (row[0]) {
        case DeleteType.User:
          data.push({ user: await deleteUser(row[1], options) });
          break;
        case DeleteType.Session:
          data.push({ sessions: await deleteSession(row[1], options) });
          break;
        case DeleteType.Contractor:
          data.push({
            contractor: await deleteContractor(row[1], options),
          });
          break;
        case DeleteType.ContractorAccreditation:
          data.push({
            contractorsAccreditations: await deleteContractorAccreditations(
              row[1],
              options
            ),
          });
          break;
        case DeleteType.Company:
          data.push({
            companies: await deleteCompany(row[1], options),
          });
          break;
        case DeleteType.CompanyUser:
          data.push({
            companyUsers: await deleteCompanyUsers(row[1], options),
          });
          break;
        case DeleteType.Job:
          data.push({ jobs: await deleteJob(row[1], options) });
          break;
        case DeleteType.Rating:
          data.push({ ratings: await deleteRating(row[1], options) });
          break;
      }
    }
    return data;
  });

  return [transactionData] as T; //(await Promise.all(promises)) as T;
}

export async function deleteUser(
  data: { userId?: number },
  options: {
    tx: TransactionType;
  }
): Promise<User> {
  const [deletedUser] = await options.tx
    .update(usersTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(usersTable.id, data.userId!))
    .returning();

  if (!deletedUser) {
    throw new AppError("Error unable to delete user", 500);
  }

  return { ...normalizeUser(deletedUser) };
}

export async function deleteSession(
  data: {
    userId?: number;
    sessionToken?: string;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<SessionsSchema> | SessionsSchema> {
  if (data.sessionToken) {
    const hashedToken = await argon2.hash(data.sessionToken);

    const [token] = await options.tx
      .delete(sessionsTable)
      .where(eq(sessionsTable.sessionToken, hashedToken))
      .returning();

    if (!token) {
      throw new AppError("Error unable to delete session", 500);
    }
    return token;
  }
  const tokens = await options.tx
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
export async function deleteContractor(
  data: {
    userId?: number;
    contractorId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Contractor> {
  const [deletedContractor] = await options.tx
    .update(contractorsTable)
    .set({ deletedAt: moment().toDate() })
    .where(
      data.userId
        ? eq(contractorsTable.userId, data.userId!)
        : eq(contractorsTable.id, data.contractorId!)
    )
    .returning();

  if (!deletedContractor) {
    throw new AppError("Error unable to delete contractor", 500);
  }

  return normalizeContractor(deletedContractor);
}

export async function deleteContractorAccreditations(
  data: {
    contractorId?: number;
    accreditationId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<ContractorsAccreditation> | ContractorsAccreditation> {
  if (data.accreditationId) {
    const [deletedAccreditation] = await options.tx
      .update(contractorsAccreditations)
      .set({ deletedAt: moment().toDate() })
      .where(eq(contractorsAccreditations.id, data.accreditationId))
      .returning();

    if (!deletedAccreditation) {
      throw new AppError("Error unable to delete accreditation", 500);
    }
    return normalizeAccreditation(deletedAccreditation);
  }
  const deletedAccreditations = await options.tx
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

export async function deleteCompany(
  data: {
    companyId?: number;
    userId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<Company> | Company> {
  if (data.companyId) {
    const [deletedCompany] = await options.tx
      .update(companiesTable)
      .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
      .where(eq(companiesTable.id, data.companyId!))
      .returning();

    if (!deletedCompany) {
      throw new AppError("Error unable to delete company", 500);
    }

    return normalizeCompany(deletedCompany);
  }

  const [usersCompanies] = await options.tx
    .select({ companyId: companiesUsersTable.companyId })
    .from(companiesUsersTable)
    .where(eq(companiesUsersTable.userId, data.userId!));

  const deletedCompanies = await options.tx
    .update(companiesTable)
    .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
    .where(eq(companiesTable.id, usersCompanies.companyId))
    .returning();

  if (!deletedCompanies) {
    throw new AppError("Error unable to delete companies", 500);
  }
  return deletedCompanies.map(normalizeCompany);
}

export async function deleteCompanyUsers(
  data: {
    companyId?: number;
    userId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<CompanyUser> | CompanyUser> {
  if (data.userId && data.companyId) {
    const [deletedCompanyUser] = await options.tx
      .update(companiesUsersTable)
      .set({ deletedAt: moment().toDate() })
      .where(
        and(
          eq(companiesUsersTable.companyId, data.companyId),
          eq(companiesUsersTable.userId, data.userId),
          ne(companiesUsersTable.role, UserCompanyRole.Owner)
        )
      )
      .returning();

    if (!deletedCompanyUser) {
      throw new AppError("Error unable to delete company user", 500);
    }

    return normalizeCompanyUser(deletedCompanyUser);
  }

  if (data.companyId) {
    const deletedCompanyUsers = await options.tx
      .update(companiesUsersTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(companiesUsersTable.companyId, data.companyId))
      .returning();

    if (!deletedCompanyUsers) {
      throw new AppError("Error unable to delete company users", 500);
    }

    return deletedCompanyUsers.map(normalizeCompanyUser);
  }

  const deletedCompanyUsers = await options.tx
    .update(companiesUsersTable)
    .set({ deletedAt: moment().toDate() })
    .where(eq(companiesUsersTable.userId, data.userId!))
    .returning();

  if (!deletedCompanyUsers) {
    throw new AppError("Error unable to delete company users", 500);
  }

  return deletedCompanyUsers.map(normalizeCompanyUser);
}

export async function deleteJob(
  data: {
    companyId?: number | Array<number>;
    jobId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<JobPostsSchemaInsert> | JobPostsSchemaInsert> {
  if (data.jobId) {
    const [deletedJob] = await options.tx
      .update(jobsTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(jobsTable.id, data.jobId))
      .returning();

    if (!deletedJob) {
      throw new AppError("Error unable to delete job post", 500);
    }

    return normalizeJobPost(deletedJob);
  }

  const deletedJobs = await options.tx
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

export async function deleteRating(
  data: {
    userId?: number;
    contractorId?: number;
    companyId?: number;
    ratingId?: number;
  },
  options: {
    tx: TransactionType;
  }
): Promise<Array<ratingsTableSchemaInsert> | ratingsTableSchemaInsert> {
  if (data.ratingId) {
    const [deletedRating] = await options.tx
      .update(ratingsTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(ratingsTable.id, data.ratingId))
      .returning();

    if (!deletedRating) {
      throw new AppError("Error unable to delete rating", 500);
    }

    return normalizeRating(deletedRating);
  }
  if (data.ratingId) {
    const deletedRatings = await options.tx
      .update(ratingsTable)
      .set({ deletedAt: moment().toDate() })
      .where(eq(ratingsTable.userId, data.userId!))
      .returning();

    if (!deletedRatings) {
      throw new AppError("Error unable to delete ratings", 500);
    }

    return deletedRatings.map(normalizeRating);
  }
  if (data.contractorId) {
    const deletedRatings = await options.tx
      .update(ratingsTable)
      .set({ deletedAt: moment().toDate() })
      .where(
        or(
          and(
            eq(ratingsTable.revieweeType, RateableType.Contractors),
            eq(ratingsTable.revieweeTypeId, data.contractorId)
          ),
          and(
            eq(ratingsTable.reviewerType, RateableType.Contractors),
            eq(ratingsTable.reviewerTypeId, data.contractorId)
          )
        )
      )
      .returning();
    return deletedRatings.map(normalizeRating);
  }
  const deletedRatings = await options.tx
    .update(ratingsTable)
    .set({ deletedAt: moment().toDate() })
    .where(
      or(
        and(
          eq(ratingsTable.revieweeType, RateableType.Companies),
          eq(ratingsTable.revieweeTypeId, data.companyId!)
        ),
        and(
          eq(ratingsTable.reviewerType, RateableType.Companies),
          eq(ratingsTable.reviewerTypeId, data.companyId!)
        )
      )
    )
    .returning();
  return deletedRatings.map(normalizeRating);
}
