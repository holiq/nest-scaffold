import { Injectable } from '@nestjs/common';
import { PrismaService } from '@services/prisma.service';
import { CreateAuditLogRequest } from '@requests/audit-log.request';
import { AuditLog } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(body: CreateAuditLogRequest): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: body,
    });
  }
}
