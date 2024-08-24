import z, { ZodFormattedError } from "zod";
import { ApiResponseError } from "@subbiesnap/constants/api-response-errors";

export type ValidationErrorResponseData = {
  errorType: ApiResponseError;
  errorMessage: string;
  issues: ZodFormattedError<unknown>;
  err: z.ZodError;
};
