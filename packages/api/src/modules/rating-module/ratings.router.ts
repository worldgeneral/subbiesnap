import { Request, Router } from "express";
import { HttpStatus } from "../../../../constants/https";
import { tryCatch } from "../../errors/try-catch";
import { paginationSchema } from "@subbiesnap/types/pagination";
import { sessionAuth } from "../auth-module/session-auth.middleware";
import { ratingAuth } from "./rating-auth.middleware";
import {
  createRatingRules,
  ratingsRules,
  updateRatingRules,
} from "@subbiesnap/types/rating";
import {
  createRating,
  deleteRating,
  getRating,
  getRatings,
  updateRating,
} from "./rating.service";

const ratingsRoutes = Router();

ratingsRoutes.get(
  "/:revieweeType/:revieweeTypeId/ratings",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const { revieweeType } = ratingsRules
      .pick({ revieweeType: true })
      .parse(req.params);
    const revieweeTypeId = Number(req.params.revieweeTypeId);
    const pagination = paginationSchema.parse(req.query);
    const ratings = await getRatings(
      revieweeType,
      revieweeTypeId,
      pagination.limit,
      pagination.offset
    );
    res.json(ratings);
  })
);

ratingsRoutes.get(
  "/ratings/:ratingId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const ratingId = Number(req.params.ratingId);
    const ratings = await getRating(ratingId);
    res.json(ratings);
  })
);

ratingsRoutes.post(
  "/:revieweeType/:revieweeTypeId/ratings",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = createRatingRules.parse(req.body);
    const { revieweeType } = ratingsRules
      .pick({ revieweeType: true })
      .parse(req.params);
    const revieweeTypeId = Number(req.params.revieweeTypeId);
    const rating = await createRating(
      data,
      revieweeType,
      revieweeTypeId,
      req.user!.id
    );
    res.json(rating).status(HttpStatus.Created);
  })
);

ratingsRoutes.patch(
  "/ratings/:ratingId",
  sessionAuth,
  ratingAuth,
  tryCatch(async (req: Request, res) => {
    const data = updateRatingRules.parse(req.body);
    const ratingId = Number(req.params.ratingId);
    const rating = await updateRating(data, ratingId, req.user!.id);
    res.json(rating);
  })
);

ratingsRoutes.delete(
  "/ratings/:ratingId",
  sessionAuth,
  ratingAuth,
  tryCatch(async (req: Request, res) => {
    const ratingId = Number(req.params.ratingId);
    const rating = await deleteRating(ratingId);
    res.json(rating);
  })
);
export { ratingsRoutes };
