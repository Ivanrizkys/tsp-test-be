import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./src/common/config/database/migrations",
  schema: "./src/common/config/database/schema.ts",
});
