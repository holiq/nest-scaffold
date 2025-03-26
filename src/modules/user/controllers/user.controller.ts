import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { UserVm } from '@viewmodels/user.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';
import {
  AuthenticatedAdmin,
  AuthenticatedUser,
} from '@utils/decorators/authenticate-user.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import { FilterSearchUser } from '@requests/user.request';

@ApiTags('(User) User')
@AuthenticatedUser()
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @SerializeResponse(UserVm, 'pagination')
  @AuthenticatedAdmin()
  @Get()
  async findAll(
    @PrismaFilter() filter: Prisma.UserFindManyArgs,
    @Query() query: FilterSearchUser,
  ) {
    return this.service.findAll(filter, query);
  }

  @ApiOperation({ summary: 'Get my profile' })
  @SerializeResponse(UserVm)
  @Get('profile')
  async profile(@UserAccess() user: User) {
    return user;
  }
}
