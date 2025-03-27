import { Prisma } from '@prisma/client';
import { BaseFilter } from '@utils/base-class/base-filter';
import { SearchAuditLogRequest } from '@requests/audit-log.request';

export class AuditLogFilter extends BaseFilter<
  Prisma.AuditLogWhereInput,
  Prisma.AuditLogFindManyArgs
> {
  constructor(
    filter: Prisma.AuditLogFindManyArgs,
    query: SearchAuditLogRequest,
  ) {
    super(filter);

    if (query.search) {
      this.searchFilter(query.search);
    }

    if (query.startDate && query.endDate) {
      this.dateFilter(query.startDate, query.endDate);
    }
  }

  searchFilter(search: string) {
    this.where = {
      ...this.where,
      OR: [
        {
          userId: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          userEmail: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    return this;
  }

  dateFilter(startDate: string, endDate: string) {
    this.where = {
      ...this.where,
      OR: [
        {
          createdAt: {
            gte: new Date(startDate),
            lte: this.getEndOfDay(endDate),
          },
        },
      ],
    };
  }
}
