import { type ZodObject, type ZodRawShape, z, ZodError } from "zod";

const envs = ["development", "production", "test"] as const;

export function validateEnv<T extends ZodRawShape>(
  env: NodeJS.ProcessEnv,
  schema: ZodObject<T>
) {
  const nodeEnvSchema = z.object({
    NODE_ENV: z.enum(envs).default("production"),
  });
  const vars = schema.merge(nodeEnvSchema).parse(env);

  return Object.freeze({
    ...vars,
    isDev: vars.NODE_ENV === "development",
    isProd: vars.NODE_ENV === "production",
    isTest: vars.NODE_ENV === "test",
  });
}
