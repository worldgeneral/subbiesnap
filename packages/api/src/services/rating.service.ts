import moment from "moment";
import { db } from "../db";
import { and, eq, isNull, ne } from "drizzle-orm";
import { AppError } from "../utils/express.error";
import z, { nan } from "zod";
import {
  RateableType,
  companiesTable,
  companiesUsersTable,
  contractorsTable,
  ratingsTable,
  ratingsTableSchema,
  ratingsTableSchemaInsert,
} from "../schemas";
import { ratingsRules } from "../rules/rating.rule";
import { NeonDbError } from "@neondatabase/serverless";
import { userIsContractor, usersCompanies } from "./checks.service";

export type Rating = Required<z.infer<typeof ratingsRules>>;

export function normalizeRating(rating: ratingsTableSchema): Rating {
  return {
    id: rating.id,
    rateableType: rating.rateableType,
    rateableModelId: rating.rateableModelId,
    rating: rating.rating as Rating["rating"],
    userId: rating.userId,
  };
}

export async function getRatings(
  rateableType: RateableType,
  rateableId: number,
  limit: number = 25,
  offset: number = 0
): Promise<Array<Rating>> {
  const result = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.rateableType, rateableType),
        eq(ratingsTable.rateableModelId, rateableId),
        isNull(ratingsTable.deletedAt)
      )
    )
    .limit(limit)
    .offset(offset);

  const ratings = result.map(normalizeRating);

  return ratings;
}

export async function getRating(ratingId: number): Promise<Rating> {
  const [ratings] = await db
    .select()
    .from(ratingsTable)
    .where(and(eq(ratingsTable.id, ratingId), isNull(ratingsTable.deletedAt)));

  if (!ratings) {
    throw new AppError("Error unable to find rating", 404);
  }

  return normalizeRating(ratings);
}

export async function createRating(
  data: Omit<
    ratingsTableSchemaInsert,
    "rateableModelId" | "userId" | "rateableType"
  >,
  rateableType: RateableType,
  rateableModelId: number,
  userId: number
): Promise<Rating> {
  try {
    const table =
      rateableType === RateableType.Contractors
        ? contractorsTable
        : companiesTable;

    const selfRateCheck =
      rateableType === RateableType.Contractors
        ? await userIsContractor(userId, rateableModelId)
        : await usersCompanies(userId);

    if (selfRateCheck === true) {
      throw new AppError("Error you can not rate yourself", 400);
    }

    const [rating] = await db
      .insert(ratingsTable)
      .values({
        ...data,
        rateableType,
        rateableModelId,
        userId,
      })
      .returning();

    const [ratingValues] = await db
      .select()
      .from(table)
      .where(eq(table.id, rateableModelId));

    await db
      .update(table)
      .set({
        avgRating:
          (ratingValues.avgRating! * ratingValues.timesRated! + data.rating) /
          (ratingValues.timesRated! + 1),
        timesRated: ratingValues.timesRated! + 1,
      })
      .where(eq(table.id, rateableModelId));

    return normalizeRating(rating);
  } catch (err) {
    if (err instanceof NeonDbError && err.code === "23505") {
      throw new AppError("Error user has already left a review", 409);
    }
    throw err;
  }
}

export async function updateRating(
  data: Pick<ratingsTableSchemaInsert, "rating">,
  ratingId: number,
  userId: number
): Promise<Rating> {
  const [rating] = await db
    .update(ratingsTable)
    .set({ ...data, updatedAt: moment().toDate() })
    .where(eq(ratingsTable.id, ratingId))
    .returning();

  if (!rating) {
    throw new AppError("Error unable to update rating", 400);
  }

  const allRatings = await db
    .select({ rating: ratingsTable.rating })
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.rateableType, rating.rateableType),
        eq(ratingsTable.rateableModelId, rating.rateableModelId)
      )
    );

  const avgRating =
    allRatings.reduce((a, b) => a + b.rating, 0) / allRatings.length;

  const table =
    rating.rateableType === "contractors" ? contractorsTable : companiesTable;

  await db
    .update(table)
    .set({ avgRating, timesRated: allRatings.length + 1 })
    .where(eq(table.id, rating.rateableModelId));

  return normalizeRating(rating);
}

export async function deleteRating(
  ratingId: number,
  userId: number
): Promise<Rating> {
  const [rating] = await db
    .update(ratingsTable)
    .set({ deletedAt: moment().toDate() })
    .where(and(eq(ratingsTable.id, ratingId), eq(ratingsTable.userId, userId)))
    .returning();

  if (!rating) {
    throw new AppError("Error unable to delete rating", 400);
  }
  const allRatings = await db
    .select({ rating: ratingsTable.rating })
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.rateableType, rating.rateableType),
        eq(ratingsTable.rateableModelId, rating.rateableModelId),
        isNull(ratingsTable.deletedAt)
      )
    );

  let avgRating =
    allRatings.reduce((a, b) => a + b.rating, 0) / allRatings.length;
  if (Number.isNaN(avgRating)) {
    avgRating = 0;
  }
  const table =
    rating.rateableType === "contractors" ? contractorsTable : companiesTable;

  await db
    .update(table)
    .set({ avgRating, timesRated: allRatings.length })
    .where(eq(table.id, rating.rateableModelId));

  return normalizeRating(rating);
}
