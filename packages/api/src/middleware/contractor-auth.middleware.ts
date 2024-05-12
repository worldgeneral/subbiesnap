import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { tryCatch } from "../utils/try.catch";
import { AppError } from "../utils/express.error";
import { and, eq, isNull } from "drizzle-orm";
import { ContractorsSchema, contractorsTable } from "../schemas";
import { companyAuthId } from "../rules/auth.rule";

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
    throw new AppError("Error user does not have permission", 403);
  }
  return result;
}
