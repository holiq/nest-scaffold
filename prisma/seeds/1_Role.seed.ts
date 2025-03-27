import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRole(): Promise<void> {
  const data = <Role[]>[
    {
      displayName: 'User',
      name: 'user',
    },
    {
      displayName: 'Admin',
      name: 'admin',
    },
  ];

  for (const row of data) {
    const item: Role = await prisma.role.findFirst({
      where: { name: row.name },
    });

    if (item) {
      await prisma.role.update({
        data: row,
        where: { id: item.id },
      });
    } else {
      await prisma.role.create({ data: row });
    }
  }
}
