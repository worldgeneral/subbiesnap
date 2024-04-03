import { companies, CompaniesSchema, companiesUsers, users } from "../schemas";
import { db } from "../db";
import { AppError } from "../utils/ExpressError";
import { normalizeUser } from "./user.service";
import { and, eq } from "drizzle-orm";
import { number } from "zod";
import moment from "moment";

type Company = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  logo: string | null;
  blurb: string | null;
};

export enum CompanyStatus {
  active = "active",
  deleted = "deleted",
}
export enum UserCompanyRole {
  Owner = 0,
  Admin = 10,
  Editor = 20,
  Contributor = 30,
}

export function normalizeCompany(company: CompaniesSchema): Company {
  return {
    id: company.id,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    name: company.name,
    logo: company.logo,
    blurb: company.blurb,
  };
}

export async function getCompany(companyId: number) {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId));

  if (!company) {
    throw new AppError("unable to find company", 404);
  }
  return normalizeCompany(company);
}

export async function registerCompany(
  name: string,
  logo: string | undefined,
  blurb: string | undefined,
  userId: number
): Promise<Company> {
  const [company] = await db
    .insert(companies)
    .values({
      name: name,
      logo: logo,
      blurb: blurb,
    })
    .returning();
  const [owner] = await db
    .insert(companiesUsers)
    .values({
      userId: userId,
      companyId: company.id,
      role: UserCompanyRole.Owner,
    })
    .returning();

  return normalizeCompany(company);
}

export async function updateCompanyData(
  name: string,
  logo: string | undefined,
  blurb: string | undefined,
  companyId: number
) {
  const [company] = await db
    .update(companies)
    .set({ updatedAt: moment().toDate(), name: name, logo: logo, blurb: blurb })
    .where(eq(companies.id, companyId))
    .returning();

  if (!companies) {
    throw new AppError("unable to update company data", 400);
  }
  return company;
}

export async function deleteCompanyData(companyId: number) {
  const [company] = await db
    .update(companies)
    .set({ deletedAt: moment().toDate(), status: CompanyStatus.deleted })
    .where(eq(companies.id, companyId))
    .returning();
  if (!companies) {
    throw new AppError("unable to delete company data", 400);
  }
  return normalizeCompany(company);
}

export async function addCompanyUser(
  userEmail: string,
  role: number,
  companyId: number
) {
  const [newUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, userEmail));

  if (!newUser) {
    throw new AppError("user does not exist", 404);
  }

  const usersCompanies = await db
    .select()
    .from(companiesUsers)
    .where(eq(companiesUsers.userId, newUser.id));

  const userCompany = usersCompanies.find(
    (data) => data.companyId === companyId
  );

  if (userCompany) {
    updateCompanyUser(newUser.id, role, companyId);
    return normalizeUser(newUser);
  }

  const [newCompanyUser] = await db
    .insert(companiesUsers)
    .values({
      userId: newUser.id,
      companyId: companyId,
      role: role,
    })
    .returning();

  return normalizeUser(newUser);
}

export async function updateCompanyUser(
  userId: number,
  role: number,
  companyId: number
) {
  const [updatedCompanyUser] = await db
    .update(companiesUsers)
    .set({ role: role })
    .where(
      and(
        eq(companiesUsers.userId, userId),
        eq(companiesUsers.companyId, companyId)
      )
    )
    .returning();

  if (!updatedCompanyUser) {
    throw new AppError("Error can not update role", 400);
  }
  return updatedCompanyUser;
}

export async function deleteCompanyUser(userId: number, companyId: number) {
  const [updatedCompanyUser] = await db
    .update(companiesUsers)
    .set({ deletedAt: moment().toDate() })
    .where(
      and(
        eq(companiesUsers.userId, userId),
        eq(companiesUsers.companyId, companyId)
      )
    )
    .returning();

  if (!updatedCompanyUser) {
    throw new AppError("Error can not delete role", 400);
  }
  return updatedCompanyUser;
}
