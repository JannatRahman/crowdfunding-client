import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// Fail fast with a clear message instead of an obscure MongoClient crash.
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your environment variables " +
    "(e.g. the Vercel project for the client)."
  );
}

const client = new MongoClient(MONGODB_URI);
// Default to the same DB name the Express server reads from ('crowdfunding')
// so the server can resolve users/sessions created by Better Auth.
const db = client.db(process.env.AUTH_DB_NAME || 'crowdfunding');

// Static origins that must always be accepted.
const staticTrustedOrigins = [
  // Always trust localhost for local development
  "http://localhost:3000",
  // Trust the deployed production frontend explicitly
  "https://crowdfunding-client-flame.vercel.app",
  // Trust the public production URL when set (e.g. https://crowdfund.vercel.app)
  process.env.NEXT_PUBLIC_SITE_URL,
  // Also trust the auth URL itself (may differ from site URL in some setups)
  process.env.BETTER_AUTH_URL,
].filter(Boolean); // remove any undefined / empty values

export const auth = betterAuth({
  // ── Base URL ────────────────────────────────────────────────────────────────
  // Better Auth normally derives its base URL from each request (works on Vercel).
  // When a canonical URL is configured, pin it explicitly so the Google OAuth
  // callback / redirect_uri is always deterministic across deployments.
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || undefined,
  // ── Trusted origins ────────────────────────────────────────────────────────
  // A function is supported: it is evaluated per request, so the caller's own
  // origin is always accepted. This makes sign-in/sign-up work on any deployed
  // domain (production, previews, aliases) without additional configuration.
  // Requests whose Origin header is still not trusted are rejected immediately.
  trustedOrigins: (request) => {
    const origins = [...staticTrustedOrigins];
    if (request) {
      const origin = request.headers.get("origin");
      if (origin) origins.push(origin);
    }
    return origins;
  },

  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "supporter"
      },
      credits: {
        type: "number",
        required: true,
        defaultValue: 0
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              credits: user.role === 'creator' ? 20 : 50,
            }
          };
        }
      }
    }
  }
});