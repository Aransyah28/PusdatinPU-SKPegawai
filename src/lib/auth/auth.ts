import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  /**
   * Field tambahan pada user: role.
   * Nilai default "user", hanya admin yang bisa mengubah ke "admin".
   */
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // user tidak bisa set role sendiri saat register
      },
    },
  },

  plugins: [admin()], // Plugin admin untuk manage role programatically
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
