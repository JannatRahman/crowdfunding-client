'use client';

import { createAuthClient } from "better-auth/react";

// BETTER_AUTH_URL has no NEXT_PUBLIC_ prefix → it is undefined in the browser.
// In the browser the correct origin is always window.location.origin — this keeps
// auth working on custom domains, Vercel aliases and preview deployments without
// any env config. NEXT_PUBLIC_SITE_URL is only used as an SSR fallback.
const baseURL =
  (typeof window !== 'undefined' ? window.location.origin : null) ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, useSession } = authClient;