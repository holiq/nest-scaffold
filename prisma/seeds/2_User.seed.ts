import { PrismaClient, User } from '@prisma/client';
import { RoleEnum } from '@modules/interfaces/role.interface';

const prisma = new PrismaClient();

export async function seedUser() {
  // Write migration here...

  const data = <User[]>[
    {
      fullname: 'Holiq',
      username: 'holiq',
      email: 'holiq@mail.com',
      password: '$2b$12$NQFVBw.0c76OP4RkMT49/Ov9j8z9Kr4fMOJy8Rm4pZtlNJj64S3dG',
    },
  ];

  // upsert = update & insert
  for (const row of data) {
    const item = await prisma.user.findFirst({
      where: { username: row.username },
    });

    if (item) {
      await prisma.user.update({
        where: { id: item.id },
        data: row,
      });
    } else {
      const user = await prisma.user.create({ data: row });

      const role = await prisma.role.findFirst({
        where: { name: RoleEnum.USER },
      });

      await prisma.pivotUserRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  }
}

// run all migrations file inside seeds folder
// -> npm run prisma:seed -- --all

// run single migration file inside seeds folder
// -> npm run prisma:seed User
