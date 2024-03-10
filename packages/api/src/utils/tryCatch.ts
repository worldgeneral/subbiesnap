import { NextFunction, Request, Response, RequestHandler } from "express";

function tryCatch(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err: unknown) => next(err));
  };
}

export { tryCatch };
