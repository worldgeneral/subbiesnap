import { and, eq, isNull } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { CompanyStatus, UserCompanyRole } from "../../constants/company-emuns";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import { companiesTable, companiesUsersTable } from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { tryCatch } from "../../errors/try-catch";
import { companyAuthId } from "../auth-module/auth.rule";

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
    throw new AppError(
      "user does not have access to this company",
      HttpStatus.Forbidden
    );
  }

  if (role < userCompany.role) {
    throw new AppError("user requires permissions", HttpStatus.Forbidden);
  }

  const [companyData] = await db
    .select()
    .from(companiesTable)
    .where(eq(companiesTable.id, companyId));

  if (companyData.status === CompanyStatus.Deleted) {
    throw new AppError("company no loner exists", HttpStatus.NotFound);
  }
  return companyData;
}
