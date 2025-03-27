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
    const [data, count] = await Promise.all([
      this.prisma.auditLog.findMany({
        ...new AuditLogFilter(filter, query),
      }),
      this.prisma.auditLog.count(),
    ]);

    const rows = data.map((auditLog) => ({
      ...auditLog,
      request: JSON.parse(auditLog.request),
      exceptions: JSON.parse(auditLog.exceptions),
    }));

    return { message: 'Get all audit logs', rows, count };
  }

  async createLog(body: CreateAuditLogRequest): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: body,
    });
  }
}
