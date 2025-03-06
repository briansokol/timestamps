import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
} satisfies Config;