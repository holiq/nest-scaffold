import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import {
  CreateAuditLogRequest,
  SearchAuditLogRequest,
} from '@requests/audit-log.request';
import { AuditLog, Prisma } from '@prisma/client';
import { AuditLogFilter } from '@modules/controllers/filters/audit-log.filter';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter: Prisma.AuditLogFindManyArgs,
    query: SearchAuditLogRequest,
  ): Promise<{ message: string; rows: AuditLog[]; count: number }> {
    const [rows, count] = await Promise.all([
      this.prisma.auditLog.findMany({
        ...new AuditLogFilter(filter, query),
      }),
      this.prisma.auditLog.count(),
    ]);

    return { message: 'Get all audit logs', rows, count };
  }

  async createLog(body: CreateAuditLogRequest): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: body,
    });
  }
}
