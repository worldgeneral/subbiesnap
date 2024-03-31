import { companies, CompaniesSchema, companies_users, users } from "../schemas";
import { db } from "../db";
import { AppError } from "../utils/ExpressError";
import { normalizeUser } from "./user.service";
import { and, eq } from "drizzle-orm";
import { number } from "zod";

type Company = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  logo: string | null;
  blurb: string | null;
};
export enum UserCompanyRole {
  Owner = 0,
  Admin = 10,
  Editor = 20,
  Contributor = 30,
  deleted = 1000,
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
    .insert(companies_users)
    .values({
      userId: userId,
      companyId: company.id,
      role: UserCompanyRole.Owner,
    })
    .returning();

  return normalizeCompany(company);
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
    .from(companies_users)
    .where(eq(companies_users.userId, newUser.id));

  const userCompany = usersCompanies.find(
    (data) => data.companyId === companyId
  );

  if (userCompany) {
    updateCompanyUser(newUser.id, role, companyId);
    return normalizeUser(newUser);
  }

  const [newCompanyUser] = await db
    .insert(companies_users)
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
    .update(companies_users)
    .set({ role: role })
    .where(
      and(
        eq(companies_users.userId, userId),
        eq(companies_users.companyId, companyId)
      )
    )
    .returning();

  if (!updatedCompanyUser) {
    throw new AppError("Error can not update role", 400);
  }
  return updatedCompanyUser;
}

export async function deleteCompanyUser(
  userId: number,
  role: number,
  companyId: number
) {
  const [updatedCompanyUser] = await db
    .update(companies_users)
    .set({ role: role })
    .where(
      and(
        eq(companies_users.userId, userId),
        eq(companies_users.companyId, companyId)
      )
    )
    .returning();

  if (!updatedCompanyUser) {
    throw new AppError("Error can not delete role", 400);
  }
  return updatedCompanyUser;
}
