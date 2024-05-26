import * as argon2 from "argon2";
import { and, eq, isNull } from "drizzle-orm";
import jwt from "jsonwebtoken";
import moment from "moment";
import { DatabaseError } from "pg";
import z from "zod";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import { sendEmail } from "../../email-client/send-email";
import {
  confirmEmailSubject,
  confirmEmailWrapper,
} from "../../email-client/templates/confirm-email";
import { AppError } from "../../errors/express-error";
import {
  companyIdFromUserId,
  contractorIdFromUserId,
} from "../soft-delete-module/soft-deletes/get-delete-type-id.service";
import {
  DeleteType,
  softDeletesHandler,
} from "../soft-delete-module/soft-deletes/soft-delete.service";
import { UserSchema, UserSchemaInsert, usersTable } from "./user.model";
import { userSchema } from "./user.rule";

export type User = Required<Omit<z.infer<typeof userSchema>, "password">>;

export function normalizeUser(user: UserSchema): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    secondName: user.secondName,
  };
}

export async function getUser(userId: number): Promise<User> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    throw new AppError("user does not exist", HttpStatus.NotFound);
  }

  return normalizeUser(user);
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  secondName: string
): Promise<User> {
  try {
    const hashPassword = await argon2.hash(password);
    const [user] = await db
      .insert(usersTable)
      .values({
        email: email,
        password: hashPassword,
        firstName: firstName,
        secondName: secondName,
      })
      .returning();

    const confirmEmailId = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!
    );
    sendEmail({
      To: [email],
      Subject: confirmEmailSubject,
      Body: {
        Html: confirmEmailWrapper({
          firstName: firstName,
          secondName: secondName,
          emailAuthId: confirmEmailId,
        }),
        Text: confirmEmailWrapper({
          firstName: firstName,
          secondName: secondName,
          emailAuthId: confirmEmailId,
        }),
      },
    });

    return normalizeUser(user);
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new AppError("User is already registered", HttpStatus.BadRequest);
    }
    throw err;
  }
}

export async function updateUser(
  userData: Partial<UserSchemaInsert>,
  userId: number
): Promise<User> {
  const [user] = await db
    .update(usersTable)
    .set({ updatedAt: moment().toDate(), ...userData })
    .where(and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)))
    .returning();

  if (!user) {
    throw new AppError("Error unable to update user", HttpStatus.BadRequest);
  }
  return normalizeUser(user);
}

export async function deleteUser(userId: number): Promise<User> {
  const companyId = await companyIdFromUserId(userId);
  const contractorId = await contractorIdFromUserId(userId);
  const result = await softDeletesHandler<[{ user: User }]>([
    userId ? [DeleteType.User, { userId }] : null,
    userId ? [DeleteType.Session, { userId }] : null,
    userId ? [DeleteType.Contractor, { userId }] : null,
    contractorId
      ? [DeleteType.ContractorAccreditation, { contractorId }]
      : null,
    userId ? [DeleteType.Company, { userId }] : null,
    userId ? [DeleteType.CompanyUser, { userId }] : null,
    companyId ? [DeleteType.Job, { companyId }] : null,
    userId ? [DeleteType.Rating, { userId }] : null,
  ]);

  return result[0].user;
}
