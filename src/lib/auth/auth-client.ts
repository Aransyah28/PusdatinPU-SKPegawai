import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Auto-detect base URL: pakai origin saat ini di browser,
  // fallback ke env var atau localhost untuk SSR/build time.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
