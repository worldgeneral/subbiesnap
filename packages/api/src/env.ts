import z from "zod";
import { validateEnv } from "./utils/validate-env";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_URL: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME_ASSETS: z.string(),
  AWS_BUCKET_NAME_UPLOADS: z.string(),
  SES_REGION: z.string(),
  JWT_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  WEBSITE_URL: z.string().url(),
});

export const env = validateEnv(process.env, schema);
