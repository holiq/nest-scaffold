import { PrismaClient } from '@prisma/client';
import * as fs from 'fs-extra';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedType = process.argv[2]; // Get the specific seed type or `--all`

  if (!seedType) {
    console.error(
      'Please provide a seed type to run (e.g., "User", "Role", or "--all")',
    );
    process.exit(1);
  }

  const seedsDir = path.join(process.cwd(), 'prisma', 'seeds');

  // Get all seed files with `.seed.ts` extension
  const seedFiles = fs
    .readdirSync(seedsDir)
    .filter((file) => file.match(/^\d+_.*\.seed\.ts$/)) // Match files with numeric prefixes
    .sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0])); // Sort by number

  if (seedType === '--all') {
    // Run all seed files in order
    for (const file of seedFiles) {
      await runSeedFile(file);
    }
    console.log('✅ All seeds completed successfully.');
  } else {
    // Run a specific seed file (ignoring numeric prefixes)
    const targetFile = seedFiles.find((file) =>
      file.includes(`_${seedType}.seed.ts`),
    );

    if (!targetFile) {
      console.error(`❌ No seed file found for "${seedType}"`);
      process.exit(1);
    }

    await runSeedFile(targetFile);
    console.log(`✅ ${seedType} seeding completed successfully.`);
  }

  await prisma.$disconnect();
}

// Function to run a seed file
async function runSeedFile(file: string) {
  try {
    const seedPath = `./seeds/${file}`;
    const seedModule = await import(seedPath);
    const baseName = file.replace(/^\d+_/, '').replace('.seed.ts', ''); // Remove numeric prefix
    const seedFunctionName = `seed${capitalize(baseName)}`;

    if (seedModule[seedFunctionName]) {
      console.log(`🚀 Running seed: ${baseName}`);
      await seedModule[seedFunctionName](prisma);
      console.log(`✅ Completed seed: ${baseName}`);
      console.log('--------------------------------------------');
    } else {
      console.warn(`⚠️ No valid seed function found in "${file}"`);
    }
  } catch (error) {
    console.error(`❌ Error running seed "${file}":`, error.message);
    process.exit(1);
  }
}

// Function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

main();
