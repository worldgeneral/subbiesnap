import moment from "moment";
import { db } from "../db";
import { and, eq, isNull } from "drizzle-orm";
import { AppError } from "../utils/express.error";
import z from "zod";
import {
  RateableType,
  companiesTable,
  contractorsTable,
  ratingsTable,
  ratingsTableSchema,
  ratingsTableSchemaInsert,
} from "../schemas";
import { ratingsRules } from "../rules/rating.rule";

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
  limit: number,
  offset: number
): Promise<Array<Rating>> {
  const result = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.rateableType, rateableType),
        eq(ratingsTable.rateableModelId, rateableId),
        isNull(ratingsTable.deleteAt)
      )
    )
    .limit(limit)
    .offset(offset);

  const ratings = result.map((rating) => normalizeRating(rating));

  return ratings;
}

export async function getRating(ratingId: number): Promise<Rating> {
  const [ratings] = await db
    .select()
    .from(ratingsTable)
    .where(and(eq(ratingsTable.id, ratingId), isNull(ratingsTable.deleteAt)));

  if (!ratings) {
    throw new AppError("Error unable to find rating", 404);
  }

  return normalizeRating(ratings);
}

export async function createRating(
  data: Omit<ratingsTableSchemaInsert, "rateableModelId" | "userId">,
  rateableType: RateableType,
  rateableModelId: number,
  userId: number
): Promise<Rating> {
  const [ratingCheck] = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.userId, userId),
        eq(ratingsTable.rateableModelId, rateableModelId)
      )
    );

  if (ratingCheck) {
    throw new AppError("Error user has already left a review", 409);
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

  const table =
    rateableType === RateableType.Contractors
      ? contractorsTable
      : companiesTable;

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
}

export async function updateRating(
  data: Pick<ratingsTableSchemaInsert, "rating">,
  ratingId: number,
  userId: number
): Promise<Rating> {
  const [rating] = await db
    .update(ratingsTable)
    .set({ ...data, updatedAt: moment().toDate() })
    .where(and(eq(ratingsTable.id, ratingId), eq(ratingsTable.userId, userId)))
    .returning();

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
    .set({ avgRating })
    .where(eq(table.id, rating.rateableModelId));

  return normalizeRating(rating);
}

export async function deleteRating(
  ratingId: number,
  userId: number
): Promise<Rating> {
  const [rating] = await db
    .update(ratingsTable)
    .set({ deleteAt: moment().toDate() })
    .where(and(eq(ratingsTable.id, ratingId), eq(ratingsTable.userId, userId)))
    .returning();

  return normalizeRating(rating);
}
