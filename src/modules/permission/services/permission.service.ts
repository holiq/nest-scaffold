import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { Prisma, Permission } from '@prisma/client';
import {
  FilterSearchPermission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from '@requests/permission.request';
import { PermissionFilter } from '../controllers/filters/permission.filter';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: Prisma.PermissionFindManyArgs,
    query: FilterSearchPermission,
  ): Promise<{ message: string; rows: Permission[]; count: number }> {
    const permissionFilter = new PermissionFilter(filter, query);

    const [rows, count] = await Promise.all([
      this.prisma.permission.findMany(permissionFilter),
      this.prisma.permission.count({ where: permissionFilter.where }),
    ]);

    return { message: 'Get all permissions', rows, count };
  }

  async findOne(id: string): Promise<Permission> {
    return this.prisma.permission.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(data: CreatePermissionRequest): Promise<Permission> {
    return this.prisma.permission.create({
      data: {
        name: data.name,
        displayName: data.displayName,
      },
    });
  }

  async update(id: string, data: UpdatePermissionRequest): Promise<Permission> {
    return this.prisma.permission.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.displayName && { displayName: data.displayName }),
      },
    });
  }

  async remove(id: string): Promise<Permission> {
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
