import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthenticatedAdmin,
  AuthenticatedUser,
} from '@utils/decorators/authenticate-user.decorator';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import { Prisma } from '@prisma/client';
import { AuditLogService } from '@services/audit-log.service';
import { SearchAuditLogRequest } from '@requests/audit-log.request';
import { AuditLogVm } from '@viewmodels/audit-log.viewmodel';
import { Permission } from '@utils/decorators/permission.decorator';

@ApiTags('(AuditLog) Audit Logs')
@AuthenticatedUser()
@Controller('audit-log')
export class AuditLogController {
  constructor(private service: AuditLogService) {}

  @ApiOperation({ summary: 'Get all audit logs' })
  @SerializeResponse({ vm: AuditLogVm, type: 'pagination', hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['audit.view'])
  @Get()
  async findAll(
    @PrismaFilter() filter: Prisma.AuditLogFindManyArgs,
    @Query() query: SearchAuditLogRequest,
  ) {
    return this.service.findAll(filter, query);
  }
}
