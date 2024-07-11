import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log("invalid environment", _env.error.format());
  throw new Error(`invalid environment, ${_env.error.format()}`);
}

export const env = _env.data;
