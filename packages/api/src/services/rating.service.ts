import moment from "moment";
import { db } from "../db";
import { and, eq, isNull } from "drizzle-orm";
import { AppError } from "../utils/express.error";
import z from "zod";
import {
  RateableType,
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
  const [rating] = await db
    .insert(ratingsTable)
    .values({
      ...data,
      rateableType,
      rateableModelId,
      userId,
    })
    .returning();

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
