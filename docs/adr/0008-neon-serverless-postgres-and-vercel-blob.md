# Neon Serverless Postgres and Vercel Blob Storage

For production hosting on Vercel, we select Neon Serverless PostgreSQL with connection pooling to prevent connection starvation across serverless function instances, using dual connection strings (`DATABASE_URL` with pooled pgbouncer and `DIRECT_URL` for Prisma CLI migrations). For industry business verification documents (PDF registration certificates), we utilize Vercel Blob for zero-configuration, secure object storage and URL delivery directly within the Vercel infrastructure.
