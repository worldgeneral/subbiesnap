import * as argon2 from "argon2";
import {
  ExtractTablesWithRelations,
  SQL,
  and,
  eq,
  inArray,
  ne,
  or,
} from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTable, PgTransaction } from "drizzle-orm/pg-core";
import moment from "moment";
import { RequireExactlyOne } from "type-fest";
import {
  CompanyStatus,
  UserCompanyRole,
} from "../../../constants/company-emuns";
import { HttpStatus } from "../../../constants/https";
import { db } from "../../../db/db";
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
} from "../../../db/schemas";
import { AppError } from "../../../errors/express-error";
import {
  Company,
  CompanyUser,
  normalizeCompany,
  normalizeCompanyUser,
} from "../../company-module/company.service";
import {
  Contractor,
  ContractorsAccreditation,
  normalizeAccreditation,
  normalizeContractor,
} from "../../contractor-module/contractor.service";
import { normalizeJobPost } from "../../job-module/jobPost.service";
import { normalizeRating } from "../../rating-module/rating.service";
import { normalizeUser } from "../../user-module/user.service";
import { User } from "@subbiesnap/types/users";

type InputData = Array<
  | null
  | [DeleteType.User, { userId: number }]
  | [
      DeleteType.Session,
      RequireExactlyOne<{ sessionToken: string; userId: number }>,
    ]
  | [
      DeleteType.Contractor,
      RequireExactlyOne<{ userId: number; contractorId: number }>,
    ]
  | [
      DeleteType.ContractorAccreditation,
      RequireExactlyOne<{ accreditationId: number; contractorId: number }>,
    ]
  | [
      DeleteType.Company,
      RequireExactlyOne<{ companyId: number; userId: number }>,
    ]
  | [
      DeleteType.CompanyUser,
      (
        | { companyId: number; userId: number }
        | RequireExactlyOne<{ companyId: number; userId: number }>
      ),
    ]
  | [
      DeleteType.Job,
      RequireExactlyOne<{ jobId: number; companyId: number | number[] }>,
    ]
  | [
      DeleteType.Rating,
      RequireExactlyOne<{
        companyId: number;
        contractorId: number;
        userId: number;
        ratingId: number;
      }>,
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
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export async function softDeletesHandler<T extends unknown[] = unknown[]>(
  inputData: InputData
): Promise<T> {
  const transactionData = await db.transaction(async (tx) => {
    let data = [];
    for (let i = 0; i < inputData.length; i++) {
      let row = inputData[i];
      if (row === null) {
        continue;
      }
      switch (row[0]) {
        case DeleteType.User:
          data.push({ user: await deleteUser(row[1], tx) });
          break;
        case DeleteType.Session:
          data.push({ sessions: await deleteSession(row[1], tx) });
          break;
        case DeleteType.Contractor:
          data.push({
            contractor: await deleteContractor(row[1], tx),
          });
          break;
        case DeleteType.ContractorAccreditation:
          data.push({
            contractorsAccreditations: await deleteContractorAccreditations(
              row[1],
              tx
            ),
          });
          break;
        case DeleteType.Company:
          data.push({
            companies: await deleteCompany(row[1], tx),
          });
          break;
        case DeleteType.CompanyUser:
          data.push({
            companyUsers: await deleteCompanyUsers(row[1], tx),
          });
          break;
        case DeleteType.Job:
          data.push({ jobs: await deleteJob(row[1], tx) });
          break;
        case DeleteType.Rating:
          data.push({ ratings: await deleteRating(row[1], tx) });
          break;
      }
    }
    return data;
  });
  return transactionData as T;
}

async function markAsDeleted<
  I extends T["$inferSelect"],
  T extends PgTable = PgTable,
  R = I[],
>(
  tx: TransactionType,
  table: T,
  where: SQL | undefined,
  msg: string,
  statusCode = HttpStatus.InternalServerError
): Promise<R> {
  const data = await tx
    .update(table)
    .set({ deletedAt: moment().toDate() })
    .where(where)
    .returning();

  if (data.length === 0) {
    throw new AppError(`Error unable to delete ${msg}`, statusCode);
  }

  return data as R;
}

async function deleteUser(
  data: { userId?: number },
  tx: TransactionType
): Promise<User[]> {
  const users = await markAsDeleted(
    tx,
    usersTable,
    eq(usersTable.id, data.userId!),
    "user"
  );
  return users.map(normalizeUser);
}

async function deleteSession(
  data: RequireExactlyOne<{ userId: number; sessionToken: string }>,
  tx: TransactionType
): Promise<Array<SessionsSchema> | SessionsSchema> {
  const tokens = await tx
    .delete(sessionsTable)
    .where(
      data.sessionToken
        ? eq(sessionsTable.sessionToken, await argon2.hash(data.sessionToken))
        : eq(sessionsTable.userId, data.userId!)
    )
    .returning();

  if ((data.sessionToken && !tokens) || (data.userId && tokens.length === 0)) {
    throw new AppError(
      "Error unable to delete session",
      HttpStatus.InternalServerError
    );
  }
  return tokens;
}
async function deleteContractor(
  data: RequireExactlyOne<{ userId: number; contractorId: number }>,
  tx: TransactionType
): Promise<Contractor[]> {
  const deletedContractor = await markAsDeleted(
    tx,
    contractorsTable,
    data.userId
      ? eq(contractorsTable.userId, data.userId!)
      : eq(contractorsTable.id, data.contractorId!),
    "contractor"
  );
  return deletedContractor.map(normalizeContractor);
}

async function deleteContractorAccreditations(
  data: RequireExactlyOne<{ contractorId: number; accreditationId: number }>,
  tx: TransactionType
): Promise<Array<ContractorsAccreditation>> {
  const deletedAccreditation = await markAsDeleted(
    tx,
    contractorsAccreditations,
    data.contractorId
      ? eq(contractorsAccreditations.contractorId, data.contractorId)
      : eq(contractorsAccreditations.id, data.accreditationId!),
    "contractor accreditation"
  );
  return deletedAccreditation.map(normalizeAccreditation);
}

async function deleteCompany(
  data: RequireExactlyOne<{ companyId: number; userId: number }>,
  tx: TransactionType
): Promise<Array<Company> | Company> {
  if (data.companyId) {
    const [deletedCompany] = await tx
      .update(companiesTable)
      .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
      .where(eq(companiesTable.id, data.companyId!))
      .returning();

    if (!deletedCompany) {
      throw new AppError(
        "Error unable to delete company",
        HttpStatus.InternalServerError
      );
    }

    return normalizeCompany(deletedCompany);
  }

  const [usersCompanies] = await db
    .select({ companyId: companiesUsersTable.companyId })
    .from(companiesUsersTable)
    .where(eq(companiesUsersTable.userId, data.userId!));

  const deletedCompanies = await tx
    .update(companiesTable)
    .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
    .where(eq(companiesTable.id, usersCompanies.companyId))
    .returning();

  if (!deletedCompanies) {
    throw new AppError(
      "Error unable to delete companies",
      HttpStatus.InternalServerError
    );
  }
  return deletedCompanies.map(normalizeCompany);
}

async function deleteCompanyUsers(
  data: {
    companyId?: number;
    userId?: number;
  },
  tx: TransactionType
): Promise<Array<CompanyUser> | CompanyUser> {
  const deletedCompanyUsers = await markAsDeleted(
    tx,
    companiesUsersTable,
    data.companyId && data.userId
      ? (eq(companiesUsersTable.companyId, data.companyId),
        eq(companiesUsersTable.userId, data.userId),
        ne(companiesUsersTable.role, UserCompanyRole.Owner))
      : data.companyId
        ? eq(companiesUsersTable.companyId, data.companyId)
        : eq(companiesUsersTable.userId, data.userId!),
    "company user"
  );
  return deletedCompanyUsers.map(normalizeCompanyUser);
}

async function deleteJob(
  data: RequireExactlyOne<{
    companyId: number | Array<number>;
    jobId: number;
  }>,
  tx: TransactionType
): Promise<Array<JobPostsSchemaInsert> | JobPostsSchemaInsert> {
  const deletedJobs = await markAsDeleted(
    tx,
    jobsTable,
    data.jobId
      ? eq(jobsTable.id, data.jobId)
      : inArray(
          jobsTable.companyId,
          Array.isArray(data.companyId) ? data.companyId! : [data.companyId!]
        ),
    "job"
  );
  return deletedJobs.map(normalizeJobPost);
}

async function deleteRating(
  data: RequireExactlyOne<{
    userId: number;
    contractorId: number;
    companyId: number;
    ratingId: number;
  }>,
  tx: TransactionType
): Promise<Array<ratingsTableSchemaInsert> | ratingsTableSchemaInsert> {
  if (data.contractorId || data.companyId) {
    const deletedRatings = await markAsDeleted(
      tx,
      ratingsTable,
      data.contractorId
        ? or(
            and(
              eq(ratingsTable.revieweeType, RateableType.Contractors),
              eq(ratingsTable.revieweeTypeId, data.contractorId!)
            ),
            and(
              (eq(ratingsTable.reviewerType, RateableType.Contractors!),
              eq(ratingsTable.reviewerTypeId, data.contractorId!))
            )
          )
        : or(
            and(
              eq(ratingsTable.revieweeType, RateableType.Companies),
              eq(ratingsTable.revieweeTypeId, data.companyId!)
            ),
            and(
              eq(ratingsTable.reviewerType, RateableType.Companies!),
              eq(ratingsTable.reviewerTypeId, data.companyId!)
            )
          ),
      "rating"
    );

    return deletedRatings.map(normalizeRating);
  }
  const deletedRatings = await markAsDeleted(
    tx,
    ratingsTable,
    data.ratingId
      ? eq(ratingsTable.id, data.ratingId)
      : eq(ratingsTable.userId, data.userId!),
    "rating"
  );

  return deletedRatings.map(normalizeRating);
}
