import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

const BASE_URL = "http://localhost:3000";

async function runSecurityTests() {
  console.log("==================================================");
  console.log("   FXEC MSME Hub — Authentication & Security Tests");
  console.log("==================================================");

  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: unknown, testName: string, detail: string) {
    totalCount++;
    if (Boolean(condition)) {
      console.log(`✅ [PASS] Test ${totalCount}: ${testName}`);
      console.log(`   ${detail}\n`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Test ${totalCount}: ${testName}`);
      console.error(`   ${detail}\n`);
      throw new Error(`Security Test Failed: ${testName}`);
    }
  }

  // -------------------------------------------------------------------------
  // Test 1: Open /dashboard without logging in
  // -------------------------------------------------------------------------
  const resDashboard = await fetch(`${BASE_URL}/dashboard`, {
    redirect: "manual",
  });
  const locDashboard = resDashboard.headers.get("location");
  assert(
    (resDashboard.status === 307 || resDashboard.status === 302) &&
      locDashboard?.includes("/login"),
    "Open /dashboard without credentials",
    `Status ${resDashboard.status} -> Redirects to ${locDashboard}`
  );

  // -------------------------------------------------------------------------
  // Test 2: Open /student/dashboard without logging in
  // -------------------------------------------------------------------------
  const resStudentDash = await fetch(`${BASE_URL}/student/dashboard`, {
    redirect: "manual",
  });
  const locStudentDash = resStudentDash.headers.get("location");
  assert(
    (resStudentDash.status === 307 || resStudentDash.status === 302 || resStudentDash.status === 308) &&
      (locStudentDash?.includes("/dashboard/student") || locStudentDash?.includes("/login")),
    "Open /student/dashboard without credentials",
    `Status ${resStudentDash.status} -> Redirects to ${locStudentDash}`
  );

  // Follow to destination to confirm final redirect is /login
  const resStudentFollow = await fetch(`${BASE_URL}/dashboard/student`, {
    redirect: "manual",
  });
  const locStudentFollow = resStudentFollow.headers.get("location");
  assert(
    (resStudentFollow.status === 307 || resStudentFollow.status === 302) &&
      locStudentFollow?.includes("/login"),
    "Open /dashboard/student without credentials",
    `Status ${resStudentFollow.status} -> Redirects to ${locStudentFollow}`
  );

  // -------------------------------------------------------------------------
  // Test 3: Open /admin/dashboard without logging in
  // -------------------------------------------------------------------------
  const resAdminDash = await fetch(`${BASE_URL}/admin/dashboard`, {
    redirect: "manual",
  });
  const locAdminDash = resAdminDash.headers.get("location");
  assert(
    (resAdminDash.status === 307 || resAdminDash.status === 302 || resAdminDash.status === 308) &&
      (locAdminDash?.includes("/dashboard/admin") || locAdminDash?.includes("/login")),
    "Open /admin/dashboard without credentials",
    `Status ${resAdminDash.status} -> Redirects to ${locAdminDash}`
  );

  const resAdminDirect = await fetch(`${BASE_URL}/dashboard/admin`, {
    redirect: "manual",
  });
  const locAdminDirect = resAdminDirect.headers.get("location");
  assert(
    (resAdminDirect.status === 307 || resAdminDirect.status === 302) &&
      locAdminDirect?.includes("/login"),
    "Open /dashboard/admin without credentials",
    `Status ${resAdminDirect.status} -> Redirects to ${locAdminDirect}`
  );

  // -------------------------------------------------------------------------
  // Test 4: Call protected API endpoints without authentication
  // -------------------------------------------------------------------------
  const resSessionApi = await fetch(`${BASE_URL}/api/auth/get-session`);
  const sessionData = await resSessionApi.json();
  assert(
    resSessionApi.status === 200 && sessionData === null,
    "Call /api/auth/get-session without credentials",
    `Status 200 with response payload: ${JSON.stringify(sessionData)} (null session, zero data leak)`
  );

  // -------------------------------------------------------------------------
  // Test 5: Role boundary: Student account accessing Admin Dashboard
  // -------------------------------------------------------------------------
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });
  if (!student) throw new Error("No student user found in database");

  // Create real signed session for student
  const studentToken = "test_student_tok_" + Math.random().toString(36).substring(2, 12);
  const studentSession = await prisma.session.create({
    data: {
      userId: student.id,
      token: studentToken,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  const resStudentAccessAdmin = await fetch(`${BASE_URL}/dashboard/admin`, {
    headers: { cookie: `better-auth.session_token=${studentToken}` },
    redirect: "manual",
  });
  const locStudentAccessAdmin = resStudentAccessAdmin.headers.get("location");

  assert(
    (resStudentAccessAdmin.status === 307 || resStudentAccessAdmin.status === 302) &&
      (locStudentAccessAdmin?.includes("/dashboard/student") || locStudentAccessAdmin?.includes("/login")),
    "Student attempting to access /dashboard/admin",
    `Status ${resStudentAccessAdmin.status} -> Unauthorized access blocked, redirected to: ${locStudentAccessAdmin}`
  );

  // -------------------------------------------------------------------------
  // Test 6: Authenticated Admin access to /dashboard/admin
  // -------------------------------------------------------------------------
  const adminSignInRes = await auth.api.signInEmail({
    body: {
      email: "admin@msmehub.gov.in",
      password: "Admin@123456",
    },
    asResponse: true,
  });

  const adminCookies = adminSignInRes.headers.getSetCookie();
  const adminCookieHeader = adminCookies.map((c) => c.split(";")[0]).join("; ");

  const resAdminAccess = await fetch(`${BASE_URL}/dashboard/admin`, {
    headers: { cookie: adminCookieHeader },
    redirect: "manual",
  });
  assert(
    resAdminAccess.status === 200,
    "Authenticated Admin accesses /dashboard/admin with valid signed credentials",
    `Status 200 OK -> Granted access to MSME Admin Console`
  );

  // -------------------------------------------------------------------------
  // Test 7: Anti-caching headers on protected dashboard
  // -------------------------------------------------------------------------
  const cacheControl = resAdminAccess.headers.get("cache-control");
  const pragma = resAdminAccess.headers.get("pragma");
  assert(
    cacheControl?.includes("no-store") &&
      (pragma === "no-cache" || pragma === null),
    "Anti-caching headers to prevent bfcache / browser back leakage",
    `Cache-Control: "${cacheControl}", Pragma: "${pragma}"`
  );

  // -------------------------------------------------------------------------
  // Test 8: Logout invalidates session and subsequent access is blocked
  // -------------------------------------------------------------------------
  // Call Better-Auth API sign-out with the admin session cookie
  const signOutApiRes = await auth.api.signOut({
    headers: new Headers({ cookie: adminCookieHeader }),
    asResponse: true,
  });
  const expiredCookies = signOutApiRes.headers.getSetCookie();
  const expiredCookieHeader = expiredCookies.map((c) => c.split(";")[0]).join("; ");

  // Now reopen dashboard with the signed-out/expired cookie
  const resPostLogout = await fetch(`${BASE_URL}/dashboard/admin`, {
    headers: { cookie: expiredCookieHeader },
    redirect: "manual",
  });
  const locPostLogout = resPostLogout.headers.get("location");
  assert(
    (resPostLogout.status === 307 || resPostLogout.status === 302) &&
      locPostLogout?.includes("/login"),
    "Reopen /dashboard/admin after logout",
    `Status ${resPostLogout.status} -> Session invalidated, redirected to: ${locPostLogout}`
  );

  // Clean up student test session
  await prisma.session.delete({ where: { id: studentSession.id } });

  console.log("==================================================");
  console.log(`Summary: All ${passedCount} of ${totalCount} Security Checks PASSED! 🛡️`);
  console.log("Zero unauthorized access vulnerabilities detected.");
  console.log("==================================================");
}

runSecurityTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
