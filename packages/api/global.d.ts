import { User } from "./src/services/user.service";

declare namespace Express {
  export interface Request {
    user?: User<Omit<"password">>;
  }
}
declare namespace Express {
  export interface Request {
    usersCompany?: number;
  }
}
