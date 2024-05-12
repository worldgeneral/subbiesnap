import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import {
  companiesTable,
  companiesUsersTable,
  contractorsTable,
} from "../db/schemas";

export async function usersCompanies(userId: number): Promise<true | false> {
  const [result] = await db
    .select()
    .from(companiesUsersTable)
    .where(eq(companiesUsersTable.userId, userId))
    .rightJoin(
      companiesTable,
      and(eq(companiesTable.id, companiesUsersTable.companyId))
    );

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

  return !result ? false : true;
}
