import { PrismaClient, Permission } from "@prisma/client";

export async function seedPermission(prisma: PrismaClient): Promise<void> {
    const data = <Permission[]>[
        {
            displayName: 'View Permissions',
            name: 'permissions.view',
        },
        {
            displayName: 'Create Permissions',
            name: 'permissions.create',
        },
        {
            displayName: 'Update Permissions',
            name: 'permissions.update',
        },
        {
            displayName: 'Delete Permissions',
            name: 'permissions.delete',
        },
        {
            displayName: 'View Roles',
            name: 'roles.view',
        },
        {
            displayName: 'Create Roles',
            name: 'roles.create',
        },
        {
            displayName: 'Update Roles',
            name: 'roles.update',
        },
        {
            displayName: 'Delete Roles',
            name: 'roles.delete',
        },
        {
            displayName: 'View Users',
            name: 'users.view',
        },
        {
            displayName: 'View Audit Logs',
            name: 'audit.view',
        },
    ];

    for (const row of data) {
        const item: Permission = await prisma.permission.findFirst({
            where: { name: row.name },
        });

        if (item) {
            await prisma.permission.update({
                data: row,
                where: { id: item.id },
            });
        } else {
            await prisma.permission.create({ data: row });
        }
    }
}