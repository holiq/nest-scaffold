import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || '',
});
const prisma = new PrismaClient({ adapter });

export async function seed() {
  // Write seed here...
}

// run all seeds file inside seeds folder
// -> npm run prisma:seed -- --all

// run single seed file inside seeds folder
// -> npm run prisma:seed User
