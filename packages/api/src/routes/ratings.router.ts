import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/try.catch";
import { sessionAuth } from "../middleware/session-auth.middleware";
import { paginationSchema } from "../rules/pagination.rule";
import {
  createRatingRules,
  ratingsRules,
  updateRatingRules,
} from "../rules/rating.rule";
import {
  createRating,
  deleteRating,
  getRating,
  getRatings,
  updateRating,
} from "../services/rating.service";

const ratingsRoutes = Router();

ratingsRoutes.get(
  "/:rateableType/:rateableId/ratings",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const { rateableType } = ratingsRules
      .pick({ rateableType: true })
      .parse(req.params);
    const rateableId = Number(req.params.rateableId);
    const pagination = paginationSchema.parse(req.query);
    const ratings = await getRatings(
      rateableType,
      rateableId,
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
  "/:rateableType/:rateableId/ratings",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = createRatingRules.parse(req.body);
    const { rateableType } = ratingsRules
      .pick({ rateableType: true })
      .parse(req.params);
    const rateableId = Number(req.params.rateableId);
    const rating = await createRating(
      data,
      rateableType,
      rateableId,
      req.user!.id
    );
    res.json(rating).status(201);
  })
);

ratingsRoutes.patch(
  "/ratings/:ratingId",
  sessionAuth,
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
  tryCatch(async (req: Request, res) => {
    const ratingId = Number(req.params.ratingId);
    const rating = await deleteRating(ratingId, req.user!.id);
    res.json(rating);
  })
);
export { ratingsRoutes };
