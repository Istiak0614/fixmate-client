/**
 * BetterAuth server config (runs only on the server, inside Next.js).
 *
 * - Users are stored in the "user" collection = FixMate's `users` collection.
 * - Extra fields (role, phone, area, bio, plan) are BetterAuth "additionalFields".
 * - SECURITY: a user can only CHOOSE customer or technician at sign up. Anything else
 *   (e.g. "admin") is saved as "customer". After sign up, role/plan can never be changed
 *   through BetterAuth — only the Express admin API (and the Stripe webhook for plan) can.
 */
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { client, db } from "./mongodb";

const SIGN_UP_ROLES = ["customer", "technician"];

// Same rules as the sign-up form: 6+ chars, one uppercase, one lowercase.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true, // signed in right after sign up -> we can redirect to the dashboard
  },

  // 7 days, the same lifetime as the Express JWT cookie
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24, // refresh the session once a day while the user is active
  },

  user: {
    additionalFields: {
      // input: true  -> may be sent at sign up (checked by the hook below)
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      // input: false -> can't be sent at sign up; updated later via Express PATCH /api/users/profile
      phone: { type: "string", required: false, input: false },
      area: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
      // (optional feature) Pro Technician Plan — changed only by the Stripe webhook on the server
      plan: { type: "string", required: false, defaultValue: "free", input: false },
    },
  },

  // Server-side password check (the form checks too, but never trust only the client)
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const password = String(ctx.body?.password ?? "");
      if (!PASSWORD_RULE.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password needs at least 6 characters, one uppercase and one lowercase letter",
        });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        // Runs for EVERY new user (email sign up and Google sign in)
        before: async (user) => {
          const role = SIGN_UP_ROLES.includes(String(user.role)) ? user.role : "customer";
          return { data: { ...user, role, plan: "free" } };
        },
      },
      update: {
        // Block role changes through BetterAuth's updateUser (e.g. a user sending role: "admin").
        // (Returning edited data is NOT enough: BetterAuth merges it with the original update.)
        // plan already can't be sent (input: false). Admins change roles via the Express API.
        before: async (user) => {
          if ("role" in user) {
            throw new APIError("FORBIDDEN", { message: "Role cannot be changed here" });
          }
        },
      },
    },
  },

  // Exact origins allowed to call the auth API (assignment: add the production domain here)
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  plugins: [nextCookies()], // must stay LAST: lets server actions set auth cookies
});

export type Session = typeof auth.$Infer.Session;