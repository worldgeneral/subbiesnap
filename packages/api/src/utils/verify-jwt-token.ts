import jwt from "jsonwebtoken";
import * as util from "util";

export const verifyToken = util.promisify(
  (
    token: string,
    secret: string,
    callBack: jwt.VerifyCallback<string | jwt.JwtPayload | undefined>
  ) => {
    jwt.verify(token, secret, (err, result) => callBack(err, result));
  }
);
