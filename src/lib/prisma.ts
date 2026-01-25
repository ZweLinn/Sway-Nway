import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Use direct TCP connection for local dev with prisma dev
  const directUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (!directUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // For prisma+postgres:// URLs, extract the direct TCP URL from the api_key
  let connectionString = directUrl;
  if (directUrl.startsWith('prisma+postgres://')) {
    // Parse the api_key which contains the actual database URL
    const url = new URL(directUrl);
    const apiKey = url.searchParams.get('api_key');
    if (apiKey) {
      try {
        const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
        connectionString = decoded.databaseUrl;
      } catch {
        throw new Error('Failed to parse DATABASE_URL api_key');
      }
    }
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
