import { nativeEnum, number, union, z } from "zod";
import { RateableType } from "../schemas";
import { MAX_RATING_VALUE } from "../utils/magic.numbers";

export const ratingsRules = z.object({
  id: number(),
  rateableType: nativeEnum(RateableType),
  rateableModelId: number(),
  rating: union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  userId: number(),
});

export const createRatingRules = ratingsRules.omit({
  id: true,
  rateableModelId: true,
  userId: true,
});

export const updateRatingRules = ratingsRules.omit({
  id: true,
  rateableType: true,
  rateableModelId: true,
  userId: true,
});
