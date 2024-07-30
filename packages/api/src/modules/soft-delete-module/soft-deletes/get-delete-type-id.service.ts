import { and, eq } from "drizzle-orm";
import { UserCompanyRole } from "../../../../../constants/company-emuns";
import { db } from "../../../db/db";
import { companiesUsersTable, contractorsTable } from "../../../db/schemas";

export async function companyIdFromUserId(
  userId: number
): Promise<Array<number> | null> {
  const ids = await db
    .select()
    .from(companiesUsersTable)
    .where(
      and(
        eq(companiesUsersTable.userId, userId),
        eq(companiesUsersTable.role, UserCompanyRole.Owner)
      )
    );

  if (!ids || ids.length === 0) {
    return null;
  }
  return ids.map((id) => id.id);
}

export async function contractorIdFromUserId(
  userId: number
): Promise<number | null> {
  const [contractorId] = await db
    .select({ contractorId: contractorsTable.id })
    .from(contractorsTable)
    .where(eq(contractorsTable.userId, userId));
  if (!contractorId) {
    return null;
  }
  return contractorId.contractorId;
}
