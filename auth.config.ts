import type { NextAuthConfig } from "next-auth";

/** Edge-safe config (used by middleware). No Node fs/crypto here. */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized() {
      return true;
    },
  },
} satisfies NextAuthConfig;
