import * as jwt from "jsonwebtoken";
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      firstName: string;
      secondName: string;
    };
  }
}
declare namespace Express {
  export interface Request {
    usersCompany?: number;
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload extends jwt.JwtPayload {
    userId: number;
  }
}
