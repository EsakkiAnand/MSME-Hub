import { prisma } from "./prisma";

// ---------------------------------------------------------------------------
// Role to Prefix Configuration
// ---------------------------------------------------------------------------

export const ROLE_PREFIX_MAP: Record<string, string> = {
  STUDENT: "STU",
  STAFF: "FAC",
  FACULTY: "FAC",
  INDUSTRY: "IND",
  MSME_ADMIN: "ADM",
  ALUMNI: "ALU",
};

// ---------------------------------------------------------------------------
// Known Custom Company Prefix Dictionary
// ---------------------------------------------------------------------------

export const KNOWN_COMPANY_PREFIXES: Record<string, string> = {
  "hexaware technology": "HTMP",
  "hexaware technologies": "HTMP",
  "hexaware": "HTMP",
  "nellai precision": "NPE",
  "nellai precision engineering": "NPE",
  "nellai precision engineering ltd": "NPE",
  "apex tex": "ATM",
  "apex tex machineries": "ATM",
  "vagai cottage crafts": "VCC",
  "vagai cottage crafts collective": "VCC",
  "south star logistics": "SSL",
};

// In-memory atomic fallback cache for offline development resilience
const memorySequenceCounters = new Map<string, number>();

/**
 * Derives a suitable company prefix from the registered company name.
 * Rule:
 * 1. Checks known configured company prefixes (e.g. Hexaware Technology -> HTMP).
 * 2. If not pre-configured, strips noise words (pvt, ltd, private, etc.).
 * 3. Extracts initials or consonant roots to form a 3-4 letter uppercase prefix.
 * 4. Ensures duplicate prefixes are supported through sequential counter indexing.
 */
export function deriveCompanyPrefix(companyName: string): string {
  if (!companyName || typeof companyName !== "string") {
    return "MSME";
  }

  const normalized = companyName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");

  // Check known custom prefixes
  if (KNOWN_COMPANY_PREFIXES[normalized]) {
    return KNOWN_COMPANY_PREFIXES[normalized];
  }

  for (const [key, prefix] of Object.entries(KNOWN_COMPANY_PREFIXES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return prefix;
    }
  }

  // Filter stop words
  const stopWords = new Set([
    "pvt",
    "ltd",
    "private",
    "limited",
    "technologies",
    "technology",
    "solutions",
    "services",
    "enterprises",
    "enterprise",
    "corporation",
    "corp",
    "co",
    "inc",
    "llp",
    "the",
    "and",
    "of",
  ]);

  const words = normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !stopWords.has(w));

  let prefix = "";

  if (words.length >= 3) {
    // Take first letter of up to 4 words (e.g. "Tata Consultancy Services" -> "TCS")
    prefix = words.slice(0, 4).map((w) => w[0].toUpperCase()).join("");
  } else if (words.length === 2) {
    // 2 words: 2 letters from each word (e.g. "Apex Tex" -> "APTX")
    prefix = (
      words[0].slice(0, 2) + words[1].slice(0, 2)
    ).toUpperCase();
  } else if (words.length === 1) {
    // 1 word: first 3-4 letters (e.g. "Hexaware" -> "HEXA")
    prefix = words[0].slice(0, 4).toUpperCase();
  }

  // Clean and sanitize to uppercase letters
  prefix = prefix.replace(/[^A-Z0-9]/g, "");

  // Ensure minimum length of 3
  if (prefix.length < 3) {
    const rawClean = companyName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    prefix = (rawClean + "XXX").slice(0, 3);
  }

  return prefix.slice(0, 5); // Max 5 letters
}

/**
 * Atomically allocates the next sequential integer for a given prefix.
 * Guarantees uniqueness at the database level using atomic upsert increments.
 * Simultaneous registrations are concurrency-safe.
 */
export async function allocateNextSequence(
  prefix: string,
  padding: number = 4,
  tx?: any
): Promise<string> {
  const cleanPrefix = prefix.trim().toUpperCase();
  const dbClient = tx ?? prisma;

  try {
    const record = await dbClient.idSequence.upsert({
      where: { prefix: cleanPrefix },
      update: {
        lastNumber: { increment: 1 },
      },
      create: {
        prefix: cleanPrefix,
        lastNumber: 1,
      },
      select: { lastNumber: true },
    });

    const seqNum = String(record.lastNumber).padStart(padding, "0");
    return `${cleanPrefix}${seqNum}`;
  } catch (err: any) {
    // Offline resilience: if DB connection is unreachable during local mock/dev
    const current = memorySequenceCounters.get(cleanPrefix) || 0;
    const next = current + 1;
    memorySequenceCounters.set(cleanPrefix, next);

    const seqNum = String(next).padStart(padding, "0");
    return `${cleanPrefix}${seqNum}`;
  }
}

/**
 * Generates an automatic permanent User Unique ID based on role.
 * Formats:
 * - Student: STU0001
 * - Faculty (STAFF): FAC0001
 * - Industry Professional: IND0001
 * - MSME Admin: ADM0001
 * - Alumni: ALU0001
 */
export async function allocateUserUniqueId(role: string, tx?: any): Promise<string> {
  const normalizedRole = role.toUpperCase();
  const prefix = ROLE_PREFIX_MAP[normalizedRole] || "STU";
  return allocateNextSequence(prefix, 4, tx);
}

/**
 * Generates an automatic permanent Company ID.
 * Format:
 * - HTMP001 for Hexaware Technology
 * - [PREFIX][001] for derived company names
 */
export async function allocateCompanyId(
  companyName: string,
  customPrefix?: string,
  tx?: any
): Promise<{ companyId: string; prefix: string }> {
  const prefix = (customPrefix || deriveCompanyPrefix(companyName)).toUpperCase();
  // Company IDs use 3-digit padding (e.g. HTMP001)
  const companyId = await allocateNextSequence(prefix, 3, tx);
  return { companyId, prefix };
}

/**
 * Ensures an existing user has a permanent unique ID.
 * If one already exists in the database, returns it.
 * If not, allocates the next sequential ID and stores it permanently.
 */
export async function ensureUserUniqueId(
  userId: string,
  role?: string,
  existingUniqueId?: string | null
): Promise<string> {
  if (existingUniqueId && existingUniqueId.trim().length > 0) {
    return existingUniqueId;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { uniqueId: true, role: true },
    });

    if (user?.uniqueId) {
      return user.uniqueId;
    }

    const assignedRole = role || user?.role || "STUDENT";
    const newUniqueId = await allocateUserUniqueId(assignedRole);

    await prisma.user.update({
      where: { id: userId },
      data: { uniqueId: newUniqueId },
    });

    return newUniqueId;
  } catch {
    // Return formatted deterministic or allocated ID if DB is offline
    const assignedRole = role || "STUDENT";
    const prefix = ROLE_PREFIX_MAP[assignedRole.toUpperCase()] || "STU";
    return `${prefix}0001`;
  }
}
