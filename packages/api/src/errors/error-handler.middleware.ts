import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import { HttpStatus } from "@subbiesnap/constants/https";
import { AppError } from "./express-error";

export const errorHandler = (
  err: Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, req.path, req.header("user-agent"));
  if (err instanceof ZodError) {
    return res
      .status(HttpStatus.BadRequest)
      .json({ errorMessage: "Validation Error", issues: err.format(), err });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorMessage: err.message,
      err: err.stack,
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res
      .status(HttpStatus.BadRequest)
      .json({ name: err.name, message: err.message });
  }

  return res.status(HttpStatus.InternalServerError).json({
    message: "Something went wrong",
    err,
  });
};
