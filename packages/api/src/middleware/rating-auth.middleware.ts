import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { tryCatch } from "../utils/try.catch";
import { AppError } from "../utils/express.error";
import { and, eq, isNull } from "drizzle-orm";
import {
  ContractorsSchema,
  RateableType,
  companiesTable,
  contractorsTable,
  ratingsTable,
} from "../schemas";
import { companyAuthId } from "../rules/auth.rule";
import { validateCompanyUser } from "./company-auth.middleware";
import { UserCompanyRole } from "../utils/magic.numbers";
import { validateContractor } from "./contractor-auth.middleware";

export const ratingAuth = tryCatch(async function (
  req: Request,
  Res: Response,
  next: NextFunction
) {
  const user = req.user;
  const ratingId = companyAuthId.parse(req.params.ratingId);
  await validateRating(user!.id, ratingId);
  next();
});

export async function validateRating(userId: number, ratingId: number) {
  const [rating] = await db
    .select()
    .from(ratingsTable)
    .where(eq(ratingsTable.id, ratingId));

  const reviewer =
    rating.reviewerType === RateableType.Companies
      ? await validateCompanyUser(
          userId,
          rating.reviewerTypeId,
          UserCompanyRole.Editor
        )
      : await validateContractor(userId, rating.reviewerTypeId);

  if (!reviewer) {
    throw new AppError("Error user does not have permission", 403);
  }
  return;
}
