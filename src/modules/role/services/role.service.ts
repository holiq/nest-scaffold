import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { Prisma, Role } from '@prisma/client';
import {
  FilterSearchRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@requests/role.request';
import { RoleFilter } from '../controllers/filters/role.filter';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: Prisma.RoleFindManyArgs,
    query: FilterSearchRole,
  ): Promise<{ message: string; rows: Role[]; count: number }> {
    const roleFilter = new RoleFilter(filter, query);

    const [rows, count] = await Promise.all([
      this.prisma.role.findMany(roleFilter),
      this.prisma.role.count({ where: roleFilter.where }),
    ]);

    return { message: 'Get all roles', rows, count };
  }

  async findOne(id: string): Promise<Role> {
    return this.prisma.role.findUniqueOrThrow({
      where: { id },
      include: {
        permissions: true,
        pivotRolePermission: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async create(data: CreateRoleRequest): Promise<Role> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        ...(data.permissionIds && {
          pivotRolePermission: {
            create: data.permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        }),
      },
      include: {
        permissions: true,
        pivotRolePermission: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateRoleRequest): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.permissionIds && {
          pivotRolePermission: {
            deleteMany: {},
            create: data.permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        }),
      },
      include: {
        permissions: true,
        pivotRolePermission: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
