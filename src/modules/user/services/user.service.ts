import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { Prisma, User } from '@prisma/client';
import { FilterSearchUser } from '@requests/user.request';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: Prisma.UserFindManyArgs,
    query: FilterSearchUser,
  ): Promise<{ message: string; rows: User[]; count: number }> {
    const [rows, count] = await Promise.all([
      this.prisma.user.findMany({
        ...filter,
        where: {
          fullname: query.fullname,
          username: query.username,
          email: query.email,
          pivotUserRole: {
            some: {
              role: {
                name: query.role,
              },
            },
          },
        },
        include: {
          pivotUserRole: {
            include: {
              role: true,
            },
          },
        },
        ...{ ignoreParanoids: ['pivotUserRole'] },
      }),
      this.prisma.user.count(),
    ]);

    return { message: 'Get all users', rows, count };
  }
}
