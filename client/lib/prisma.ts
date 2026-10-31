import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dns from "node:dns";

// Reliable DNS resolution for cloud database endpoints (e.g. Neon on restricted network/Wi-Fi DNS)
if (typeof dns.setServers === "function") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    const originalLookup = dns.lookup.bind(dns);
    (dns as any).lookup = (hostname: string, options: any, callback: any) => {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      dns.resolve4(hostname, (err, addresses) => {
        if (!err && addresses && addresses.length > 0) {
          if (options && options.all) {
            return callback(
              null,
              addresses.map((a) => ({ address: a, family: 4 }))
            );
          }
          return callback(null, addresses[0], 4);
        }
        return originalLookup(hostname, options, callback);
      });
    };
  } catch {
    // Fall back to default system resolver
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/msme_hub?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
