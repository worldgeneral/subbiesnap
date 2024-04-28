import {
  companiesTable,
  CompaniesSchema,
  companiesUsersTable,
  usersTable,
  CompaniesSchemaInsert,
  CompaniesUsersSchema,
} from "../schemas";
import { db } from "../db";
import { AppError } from "../utils/express.error";
import { User, normalizeUser } from "./user.service";
import { and, eq, is, isNull } from "drizzle-orm";
import { z } from "zod";
import moment from "moment";
import { companySchema, companyUserSchema } from "../rules/company.rule";
import { CompanyStatus, UserCompanyRole } from "../utils/magic.numbers";

export type Company = Required<z.infer<typeof companySchema>>;
export type CompanyUser = Required<z.infer<typeof companyUserSchema>>;

export function normalizeCompany(company: CompaniesSchema): Company {
  return {
    id: company.id,
    name: company.name,
    logo: company.logo,
    blurb: company.blurb,
    avgRating: company.avgRating,
    timesRated: company.timesRated,
  };
}

export function normalizeCompanyUser(user: CompaniesUsersSchema): CompanyUser {
  return {
    id: user.id,
    userId: user.userId,
    role: user.role,
  };
}

export async function getCompany(companyId: number): Promise<Company> {
  const [company] = await db
    .select()
    .from(companiesTable)
    .where(
      and(eq(companiesTable.id, companyId), isNull(companiesTable.deletedAt))
    );

  if (!company) {
    throw new AppError("unable to find company", 404);
  }
  return normalizeCompany(company);
}

export async function getCompanies(
  limit: number = 25,
  offset: number = 0
): Promise<Array<Company>> {
  const result = await db
    .select()
    .from(companiesTable)
    .where(isNull(companiesTable.deletedAt))
    .limit(limit)
    .offset(offset);

  const companies = result.map((company) => normalizeCompany(company));
  return companies;
}

export async function registerCompany(
  companyData: Omit<
    CompaniesSchemaInsert,
    "userId" | "avgRating" | "timesRated"
  >,
  userId: number
): Promise<Company> {
  const [company] = await db
    .insert(companiesTable)
    .values({ ...companyData })
    .returning();

  await db.insert(companiesUsersTable).values({
    userId: userId,
    companyId: company.id,
    role: UserCompanyRole.Owner,
  });

  return normalizeCompany(company);
}

export async function updateCompanyData(
  companyData: Partial<CompaniesSchemaInsert>,
  companyId: number
): Promise<Company> {
  const [company] = await db
    .update(companiesTable)
    .set({ updatedAt: moment().toDate(), ...companyData })
    .where(
      and(eq(companiesTable.id, companyId), isNull(companiesTable.deletedAt))
    )
    .returning();

  if (!company) {
    throw new AppError("unable to update company data", 400);
  }
  return normalizeCompany(company);
}

export async function deleteCompanyData(companyId: number): Promise<Company> {
  const [company] = await db
    .update(companiesTable)
    .set({ deletedAt: moment().toDate(), status: CompanyStatus.Deleted })
    .where(eq(companiesTable.id, companyId))
    .returning();
  if (!company) {
    throw new AppError("unable to delete company data", 400);
  }
  return normalizeCompany(company);
}

export async function getCompanyUser(
  limit: number = 25,
  offset: number = 0,
  companyId: number
): Promise<Array<User>> {
  const result = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(companiesUsersTable.userId, usersTable.id),
        isNull(usersTable.deletedAt),
        isNull(companiesUsersTable.deletedAt)
      )
    )
    .innerJoin(
      companiesUsersTable,
      and(
        eq(companiesUsersTable.companyId, companyId),
        isNull(usersTable.deletedAt),
        isNull(companiesUsersTable.deletedAt)
      )
    )
    .limit(limit)
    .offset(offset);
  const users = result.map((user) => {
    return {
      ...normalizeUser(user.users),
      role: user.companies_users.role,
    };
  });
  return users;
}

export async function addCompanyUser(
  userEmail: string,
  role: number,
  companyId: number
): Promise<User> {
  const [newUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (!newUser) {
    throw new AppError("user does not exist", 404);
  }

  const [userCompany] = await db
    .select()
    .from(companiesUsersTable)
    .where(
      and(
        eq(companiesUsersTable.userId, newUser.id),
        eq(companiesUsersTable.companyId, companyId)
      )
    );

  if (userCompany) {
    await updateCompanyUser(newUser.id, role, companyId);
    return normalizeUser(newUser);
  }

  await db.insert(companiesUsersTable).values({
    userId: newUser.id,
    companyId: companyId,
    role: role,
  });

  return normalizeUser(newUser);
}

export async function updateCompanyUser(
  userId: number,
  role: number,
  companyId: number
): Promise<[User, CompanyUser]> {
  const [updatedCompanyUser] = await db
    .update(companiesUsersTable)
    .set({ role: role })
    .where(
      and(
        eq(companiesUsersTable.userId, userId),
        eq(companiesUsersTable.companyId, companyId),
        isNull(companiesUsersTable.deletedAt)
      )
    )
    .returning();

  if (!updatedCompanyUser) {
    throw new AppError("Error can not update role", 400);
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, updatedCompanyUser.userId));

  return [normalizeUser(user), normalizeCompanyUser(updatedCompanyUser)];
}

export async function deleteCompanyUser(
  userId: number,
  companyId: number
): Promise<CompanyUser> {
  const [deletedCompanyUser] = await db
    .update(companiesUsersTable)
    .set({ deletedAt: moment().toDate() })
    .where(
      and(
        eq(companiesUsersTable.userId, userId),
        eq(companiesUsersTable.companyId, companyId)
      )
    )
    .returning();

  if (!deletedCompanyUser) {
    throw new AppError("Error can not delete role", 400);
  }
  return normalizeCompanyUser(deletedCompanyUser);
}
