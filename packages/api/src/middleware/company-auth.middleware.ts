import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { tryCatch } from "../utils/try.catch";
import { AppError } from "../utils/express.error";
import { and, eq, isNull } from "drizzle-orm";
import { companiesTable, companiesUsersTable } from "../schemas";
import { companyAuthId } from "../rules/auth.rule";
import { CompanyStatus, UserCompanyRole } from "../utils/magic.numbers";
import { CompanyUser } from "../services/company.service";

export const companyAuth = (role: UserCompanyRole) =>
  tryCatch(async function (req: Request, Res: Response, next: NextFunction) {
    const user = req.user;
    const companyId = companyAuthId.parse(req.params.companyId);
    const companyData = await validateCompanyUser(user!.id, companyId, role);
    req.usersCompany = companyData.id;

    next();
  });

export async function validateCompanyUser(
  userId: number,
  companyId: number,
  role: UserCompanyRole
) {
  const [userCompany] = await db
    .select()
    .from(companiesUsersTable)
    .where(
      and(
        eq(companiesUsersTable.userId, userId),
        eq(companiesUsersTable.companyId, companyId),
        isNull(companiesUsersTable.deletedAt)
      )
    );

  if (!userCompany) {
    throw new AppError("user does not have access to this company", 403);
  }

  if (role < userCompany.role) {
    throw new AppError("user requires permissions", 403);
  }

  const [companyData] = await db
    .select()
    .from(companiesTable)
    .where(eq(companiesTable.id, companyId));

  if (companyData.status === CompanyStatus.Deleted) {
    throw new AppError("company no loner exists", 404);
  }
  return companyData;
}