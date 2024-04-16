import { NextFunction, Request, Response, RequestHandler } from "express";

function tryCatch<P, ResB, ReqB, Q>(
  fn: (
    req: Request<P, ResB, ReqB, Q>,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return function (
    req: Request<P, ResB, ReqB, Q>,
    res: Response,
    next: NextFunction
  ) {
    fn(req, res, next).catch((err: unknown) => next(err));
  };
}

export { tryCatch };
