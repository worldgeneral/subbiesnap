import { nativeEnum, number, union, z } from "zod";

export enum RateableType {
  Contractors = "contractors",
  Companies = "companies",
}

export type Rating = Required<z.infer<typeof ratingsRules>>;

export const ratingsRules = z.object({
  id: number(),
  reviewerType: nativeEnum(RateableType),
  reviewerTypeId: number(),
  revieweeType: nativeEnum(RateableType),
  revieweeTypeId: number(),
  ratingValue: union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  userId: number(),
});

export const createRatingRules = ratingsRules
  .omit({
    id: true,
    revieweeType: true,
    revieweeTypeId: true,
    userId: true,
  })
  .required({
    reviewerType: true,
    reviewerTypeId: true,
  });

export const updateRatingRules = ratingsRules.omit({
  id: true,
  revieweeType: true,
  revieweeTypeId: true,
  reviewerType: true,
  reviewerTypeId: true,
  userId: true,
});
