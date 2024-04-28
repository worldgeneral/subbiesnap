import { db } from "../db";
import { and, eq, isNull } from "drizzle-orm";
import { AppError } from "../utils/express.error";
import {
  companiesTable,
  companiesUsersTable,
  contractorsTable,
} from "../schemas";

export async function usersCompanies(
  userId: number,
  rateableModelId: number
): Promise<true | false> {
  const [result] = await db
    .select()
    .from(companiesUsersTable)
    .where(eq(companiesUsersTable.userId, userId))
    .rightJoin(
      companiesTable,
      and(eq(companiesTable.id, companiesUsersTable.companyId))
    );
  console.log(result);
  return !result ? false : true;
}

export async function userIsContractor(
  userId: number,
  rateableModelId: number
): Promise<true | false> {
  const [result] = await db
    .select()
    .from(contractorsTable)
    .where(
      and(
        eq(contractorsTable.userId, userId),
        eq(contractorsTable.id, rateableModelId)
      )
    );
  console.log(result);
  return !result ? false : true;
}
