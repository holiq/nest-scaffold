import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed() {
  // Write seed here...
}

// run all seeds file inside seeds folder
// -> npm run prisma:seed -- --all

// run single seed file inside seeds folder
// -> npm run prisma:seed User
