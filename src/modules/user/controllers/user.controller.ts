import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { UserVm } from '@viewmodels/user.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';
import { AuthenticatedUser } from '@utils/decorators/authenticate-user.decorator';

@ApiTags('(User) User')
@AuthenticatedUser()
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Get my profile' })
  @SerializeResponse(UserVm)
  @Get('profile')
  async profile(@UserAccess() user: User) {
    return {
      // message: 'Get profile',
      // data: user,
    };
  }
}
