import { PivotUserRole, PrismaClient, Role, User } from '@prisma/client';
import { RoleEnum } from '../../src/modules/auth/interfaces/role.interface';

const prisma = new PrismaClient();

export async function seedUser(): Promise<void> {
  type UserSeed = User & {
    role?: RoleEnum;
  };

  const data = <UserSeed[]>[
    {
      fullname: 'Holiq',
      username: 'holiq',
      email: 'holiq@mail.com',
      password: '$2b$12$NQFVBw.0c76OP4RkMT49/Ov9j8z9Kr4fMOJy8Rm4pZtlNJj64S3dG', // password
      role: RoleEnum.ADMIN,
    },
    {
      fullname: 'John Doe',
      username: 'john',
      email: 'john@mail.com',
      password: '$2b$12$NQFVBw.0c76OP4RkMT49/Ov9j8z9Kr4fMOJy8Rm4pZtlNJj64S3dG', // password
      role: RoleEnum.USER,
    },
  ];

  for (const row of data) {
    const user: User = await prisma.user.findFirst({
      where: { username: row.username },
    });

    const role: Role = row.role
      ? await prisma.role.findFirst({ where: { name: row.role } })
      : null;

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          fullname: row.fullname,
          username: row.username,
          email: row.email,
          password: row.password,
        },
      });

      const userRole: PivotUserRole = await prisma.pivotUserRole.findFirst({
        where: { userId: user.id },
      });

      if (userRole) {
        if (row.role) {
          await prisma.pivotUserRole.update({
            where: {
              userId_roleId: { userId: user.id, roleId: userRole.roleId },
            },
            data: { roleId: role?.id ?? userRole.roleId },
          });
        } else {
          await prisma.pivotUserRole.delete({
            where: {
              userId_roleId: { userId: user.id, roleId: userRole.roleId },
            },
          });
        }
      } else if (row.role && role) {
        await prisma.pivotUserRole.create({
          data: { userId: user.id, roleId: role.id },
        });
      }
    } else {
      const newUser: User = await prisma.user.create({
        data: {
          fullname: row.fullname,
          username: row.username,
          email: row.email,
          password: row.password,
        },
      });

      if (row.role && role) {
        await prisma.pivotUserRole.create({
          data: { userId: newUser.id, roleId: role.id },
        });
      }
    }
  }
}
