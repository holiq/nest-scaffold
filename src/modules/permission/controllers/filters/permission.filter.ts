import { Prisma } from '@prisma/client';
import { BaseFilter } from '@utils/base-class/base-filter';
import { FilterSearchPermission } from '@requests/permission.request';

export class PermissionFilter extends BaseFilter<
  Prisma.PermissionWhereInput,
  Prisma.PermissionFindManyArgs
> {
  constructor(
    filter: Prisma.PermissionFindManyArgs,
    query: FilterSearchPermission,
  ) {
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
