declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      createdAt: data;
      updatedAt: data;
      email: string;
      firstName: string;
      secondName: string;
    };
  }
}
