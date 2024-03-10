import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/ExpressError";
import { ZodError } from "zod";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ errorMessage: "Validation Error", issues: err.issues });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorMessage: err.message,
    });
  }

  return res.status(500).send("Something went wrong");
};

export { errorHandler };
