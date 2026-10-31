import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@msmehub.gov.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
  const adminName = process.env.ADMIN_NAME || "MSME Central Administrator";

  console.log(`Checking if admin user exists: ${adminEmail}...`);

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });

  if (existing) {
    console.log(`User ${adminEmail} already exists. Ensuring MSME_ADMIN role...`);
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: UserRole.MSME_ADMIN,
        isVerified: true,
      },
    });
    console.log(`Updated ${adminEmail} to MSME_ADMIN.`);
    return;
  }

  console.log(`Creating root MSME_ADMIN user...`);
  const res = await auth.api.signUpEmail({
    body: {
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
    },
  });

  if (!res || !res.user) {
    throw new Error("Failed to create admin user via Better Auth.");
  }

  await prisma.user.update({
    where: { id: res.user.id },
    data: {
      role: UserRole.MSME_ADMIN,
      isVerified: true,
    },
  });

  console.log("==========================================");
  console.log("Root MSME Admin created successfully!");
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Role:     MSME_ADMIN`);
  console.log("==========================================");
}

seedAdmin()
  .catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
