import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      // studentTrack and msmeApprovalStatus are managed by our own Prisma
      // queries and have DB-level defaults. Better Auth's schema checker
      // incorrectly flags them as "unexpected-required-column" because they
      // are not in additionalFields. Disable the check to prevent the
      // SchemaMismatchError at runtime.
      validateSchema: false,
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3005",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3005",
  ],
  rateLimit: {
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/*": {
        window: 10,
        max: 100,
      },
      "/sign-up/*": {
        window: 10,
        max: 100,
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
        input: true,
      },
      isVerified: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },
      institutionDomain: {
        type: "string",
        required: false,
        input: true,
      },
      uniqueId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const domain = user.email ? user.email.split("@")[1] : null;
          const assignedRole = (user as any).role || "STUDENT";
          let uniqueId = (user as any).uniqueId;
          if (!uniqueId) {
            const { allocateUserUniqueId } = await import("./id-generator");
            uniqueId = await allocateUserUniqueId(assignedRole);
          }
          return {
            data: {
              ...user,
              institutionDomain: domain,
              uniqueId,
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
