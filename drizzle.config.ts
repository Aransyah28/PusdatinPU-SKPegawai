import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

// Muat .env.local persis seperti Next.js dev server
// sehingga drizzle-kit bisa membaca DATABASE_URL dan DATABASE_AUTH_TOKEN
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
