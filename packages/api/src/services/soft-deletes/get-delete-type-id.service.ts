import { db } from "../../db";
import { AppError } from "../../utils/express.error";
import { and, eq, isNull } from "drizzle-orm";
import { DeleteType } from "./soft-delete.service";
import {
  companiesTable,
  companiesUsersTable,
  contractorsTable,
  jobsTable,
} from "../../schemas";
import { jobPostsSchema } from "../../rules/jobPost.rule";
import { UserCompanyRole } from "../../utils/magic.numbers";

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
