import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const directUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

let connectionString = directUrl;
if (directUrl.startsWith("prisma+postgres://")) {
  const url = new URL(directUrl);
  const apiKey = url.searchParams.get("api_key");
  if (apiKey) {
    const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString());
    connectionString = decoded.databaseUrl;
  }
}

const pool = new pg.Pool({ connectionString });

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const result = await pool.query(
  `UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = $1 RETURNING "email", "role"`,
  [email]
);

if (result.rowCount === 0) {
  console.error(`No user found with email: ${email}`);
} else {
  console.log(`Updated: ${result.rows[0].email} -> role: ${result.rows[0].role}`);
}

await pool.end();
