import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { UserCompanyRole } from "../../constants/company-emuns";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import { RateableType, ratingsTable } from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { tryCatch } from "../../errors/try-catch";
import { companyAuthId } from "../auth-module/auth.rule";
import { validateCompanyUser } from "../company-module/company-auth.middleware";
import { validateContractor } from "../contractor-module/contractor-auth.middleware";

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
    throw new AppError(
      "Error user does not have permission",
      HttpStatus.Forbidden
    );
  }
  return;
}
