import { PrismaClient, Role } from '@prisma/client';

export async function seedRole(prisma: PrismaClient): Promise<void> {
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

  const adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  });

  const allPermissions = await prisma.permission.findMany();

  if (adminRole) {
    await prisma.pivotRolePermission.deleteMany({
      where: { roleId: adminRole.id },
    });
    await prisma.pivotRolePermission.createMany({
      data: allPermissions.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }

  const userRole = await prisma.role.findFirst({
    where: { name: 'user' },
  });

  const viewPermissions = await prisma.permission.findMany({
    where: {
      name: {
        endsWith: '.view',
      },
    },
  });

  if (userRole) {
    await prisma.pivotRolePermission.deleteMany({
      where: { roleId: userRole.id },
    });
    await prisma.pivotRolePermission.createMany({
      data: viewPermissions.map((permission) => ({
        roleId: userRole.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }
}
