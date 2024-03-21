declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      created_at: data;
      updated_at: data;
      email: string;
      first_name: string;
      second_name: string;
    };
  }
}
