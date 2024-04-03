import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/ExpressError";
import { and, eq, isNull } from "drizzle-orm";
import { companies, companiesUsers } from "../schemas";
import { CompanyStatus, UserCompanyRole } from "../services/company.service";

export const companyAuth = (role: UserCompanyRole) =>
  tryCatch(async function (req: Request, Res: Response, next: NextFunction) {
    const user = req.user;
    const companyId = Number(req.params.companyId);
    const [userCompany] = await db
      .select()
      .from(companiesUsers)
      .where(
        and(
          eq(companiesUsers.userId, user!.id),
          eq(companiesUsers.companyId, companyId),
          isNull(companiesUsers.deletedAt)
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
      .from(companies)
      .where(eq(companies.id, companyId));

    if (companyData.status === CompanyStatus.Deleted) {
      throw new AppError("company no loner exists", 404);
    }

    next();
  });
