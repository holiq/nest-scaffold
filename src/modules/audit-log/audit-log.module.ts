import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma.module';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuditLogService],
  controllers: [AuditLogController],
})
export class AuditLogModule {}
