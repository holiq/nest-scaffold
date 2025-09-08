import { Prisma } from '@prisma/client';
import { BaseFilter } from '@utils/base-class/base-filter';
import { FilterSearchRole } from '@requests/role.request';

export class RoleFilter extends BaseFilter<
  Prisma.RoleWhereInput,
  Prisma.RoleFindManyArgs
> {
  constructor(filter: Prisma.RoleFindManyArgs, query: FilterSearchRole) {
    super(filter);

    if (query.name) {
      this.searchFilter(query.name);
    }
  }

  searchFilter(search: string) {
    this.where = {
      ...this.where,
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          displayName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    return this;
  }
}
