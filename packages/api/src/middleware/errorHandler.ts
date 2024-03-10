import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/ExpressError";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorMessage: err.message,
    });
  }

  return res.status(500).send("Something went wrong");
};

export { errorHandler };
