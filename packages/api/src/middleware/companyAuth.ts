import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { tryCatch } from "../utils/tryCatch";
import { AppError } from "../utils/ExpressError";
import { and, eq } from "drizzle-orm";
import { companies_users } from "../schemas";
import { UserCompanyRole } from "../services/company.service";

export const companyAuth = (role: UserCompanyRole) =>
  tryCatch(async function (req: Request, Res: Response, next: NextFunction) {
    const user = req.user;
    const companyId = Number(req.params.companyId);
    const [userCompany] = await db
      .select()
      .from(companies_users)
      .where(
        and(
          eq(companies_users.userId, user!.id),
          eq(companies_users.id, companyId)
        )
      );

    if (!userCompany) {
      throw new AppError("user can not access to this company", 403);
    }

    if (role < userCompany.role) {
      throw new AppError("user requires permissions", 403);
    }

    next();
  });
