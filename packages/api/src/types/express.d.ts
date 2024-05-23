declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      firstName: string;
      secondName: string;
    };
    usersCompany?: number;
  }
}
