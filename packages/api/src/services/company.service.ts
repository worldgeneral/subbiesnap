import { Companies, CompaniesSchema, Companies_users } from "../schemas";
import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";

type Company = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  logo: string | null;
  blurb: string | null;
};

export async function registerCompany(
  name: string,
  logo: string,
  blurb: string
): Promise<Company> {
  try {
    const [company] = await db
      .insert(Companies)
      .values({
        name: name,
        logo: logo,
        blurb: blurb,
      })
      .returning();

    return normalizeCompany(company);
  } catch (err) {
    throw err;
  }
}

export async function setCompanyOwner(userId: number, companyId: number) {
  try {
    const [owner] = await db
      .insert(Companies_users)
      .values({
        userId: userId,
        companyId: companyId,
        role: "owner",
      })
      .returning();

    return owner;
  } catch (err) {
    throw err;
  }
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
