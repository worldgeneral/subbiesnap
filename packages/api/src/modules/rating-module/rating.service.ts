import { and, eq, isNull } from "drizzle-orm";
import moment from "moment";
import { DatabaseError } from "pg";
import { UserCompanyRole } from "../../constants/company-emuns";
import { HttpStatus } from "../../constants/https";
import { db } from "../../db/db";
import {
  RateableType,
  companiesTable,
  contractorsTable,
  ratingsTable,
  ratingsTableSchema,
  ratingsTableSchemaInsert,
} from "../../db/schemas";
import { AppError } from "../../errors/express-error";
import { validateCompanyUser } from "../company-module/company-auth.middleware";
import {
  DeleteType,
  softDeletesHandler,
} from "../soft-delete-module/soft-deletes/soft-delete.service";
import { userIsContractor, usersCompanies } from "./checks.service";
import { Rating } from "@subbiesnap/types/rating";

export function normalizeRating(rating: ratingsTableSchema): Rating {
  return {
    id: rating.id,
    revieweeType: rating.revieweeType as RateableType,
    revieweeTypeId: rating.revieweeTypeId,
    reviewerType: rating.reviewerType as RateableType,
    reviewerTypeId: rating.reviewerTypeId,
    ratingValue: rating.ratingValue as Rating["ratingValue"],
    userId: rating.userId,
  };
}

export async function getRatings(
  revieweeType: RateableType,
  revieweeTypeId: number,
  limit: number = 25,
  offset: number = 0
): Promise<Array<Rating>> {
  const result = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.revieweeType, revieweeType),
        eq(ratingsTable.revieweeTypeId, revieweeTypeId),
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
    throw new AppError("Error unable to find rating", HttpStatus.NotFound);
  }

  return normalizeRating(ratings);
}

export async function createRating(
  data: Pick<
    ratingsTableSchemaInsert,
    "ratingValue" | "reviewerType" | "reviewerTypeId"
  >,
  revieweeType: RateableType,
  revieweeTypeId: number,
  userId: number
): Promise<Rating> {
  try {
    if (data.reviewerType === RateableType.Companies) {
      await validateCompanyUser(
        userId,
        data.reviewerTypeId,
        UserCompanyRole.Editor
      );
    } else {
      const validateContractor = await db
        .select()
        .from(contractorsTable)
        .where(
          and(
            eq(contractorsTable.id, revieweeTypeId),
            eq(contractorsTable.userId, userId)
          )
        );
      if (!validateContractor) {
        throw new AppError(
          "Error you don't have access to contractor",
          HttpStatus.Forbidden
        );
      }
    }
    const table =
      revieweeType === RateableType.Contractors
        ? contractorsTable
        : companiesTable;

    const selfRateCheck =
      revieweeType === RateableType.Contractors
        ? await userIsContractor(userId, revieweeTypeId)
        : await usersCompanies(userId);

    if (selfRateCheck === true) {
      throw new AppError(
        "Error you can not rate yourself",
        HttpStatus.BadRequest
      );
    }

    const [rating] = await db
      .insert(ratingsTable)
      .values({
        ...data,
        revieweeType,
        revieweeTypeId,
        userId,
      })
      .returning();

    const [ratingValues] = await db
      .select()
      .from(table)
      .where(eq(table.id, revieweeTypeId));

    await db
      .update(table)
      .set({
        avgRating:
          (ratingValues.avgRating! * ratingValues.timesRated! +
            data.ratingValue) /
          (ratingValues.timesRated! + 1),
        timesRated: ratingValues.timesRated! + 1,
      })
      .where(eq(table.id, revieweeTypeId));

    return normalizeRating(rating);
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new AppError(
        "Error user has already left a review",
        HttpStatus.Conflict
      );
    }
    throw err;
  }
}

export async function updateRating(
  data: Pick<ratingsTableSchemaInsert, "ratingValue">,
  ratingId: number,
  userId: number
): Promise<Rating> {
  const [rating] = await db
    .update(ratingsTable)
    .set({ ...data, updatedAt: moment().toDate() })
    .where(eq(ratingsTable.id, ratingId))
    .returning();

  if (!rating) {
    throw new AppError("Error unable to update rating", HttpStatus.BadRequest);
  }

  const allRatings = await db
    .select({ rating: ratingsTable.ratingValue })
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.revieweeType, rating.revieweeType),
        eq(ratingsTable.revieweeTypeId, rating.revieweeTypeId)
      )
    );

  const avgRating =
    allRatings.reduce((a, b) => a + b.rating, 0) / allRatings.length;

  const table =
    rating.revieweeType === "contractors" ? contractorsTable : companiesTable;

  await db
    .update(table)
    .set({ avgRating, timesRated: allRatings.length + 1 })
    .where(eq(table.id, rating.revieweeTypeId));

  return normalizeRating(rating);
}

export async function deleteRating(ratingId: number): Promise<Rating> {
  const result = await softDeletesHandler<[{ ratings: Rating }]>([
    ratingId ? [DeleteType.Rating, { ratingId }] : null,
  ]);
  const rating = result[0].ratings;

  const allRatings = await db
    .select({ rating: ratingsTable.ratingValue })
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.revieweeType, rating.revieweeType),
        eq(ratingsTable.revieweeTypeId, rating.revieweeTypeId),
        isNull(ratingsTable.deletedAt)
      )
    );

  let avgRating =
    allRatings.reduce((a, b) => a + b.rating, 0) / allRatings.length;
  if (Number.isNaN(avgRating)) {
    avgRating = 0;
  }
  const table =
    rating.revieweeType === "contractors" ? contractorsTable : companiesTable;

  await db
    .update(table)
    .set({ avgRating, timesRated: allRatings.length })
    .where(eq(table.id, rating.revieweeTypeId));

  return rating;
}
