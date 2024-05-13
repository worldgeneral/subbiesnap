import { and, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import { ContractorsSchema, contractorsTable } from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { tryCatch } from "../../errors/try-catch";
import { companyAuthId } from "../auth-module/auth.rule";

export const contractorAuth = tryCatch(async function (
  req: Request,
  Res: Response,
  next: NextFunction
) {
  const user = req.user;
  const contractorId = companyAuthId.parse(req.params.contractorId);
  await validateContractor(user!.id, contractorId);
  next();
});

export async function validateContractor(
  userId: number,
  contractorId: number
): Promise<ContractorsSchema> {
  const [result] = await db
    .select()
    .from(contractorsTable)
    .where(
      and(
        eq(contractorsTable.id, contractorId),
        eq(contractorsTable.userId, userId)
      )
    );
  if (!result) {
    throw new AppError(
      "Error user does not have permission",
      HttpStatus.Forbidden
    );
  }
  return result;
}
