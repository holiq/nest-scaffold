import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services/auth.service';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  RefreshTokenRequest,
} from '@requests/auth.request';
import {
  AuthLoginVm,
  AuthRegisterVm,
  RefreshTokenVm,
} from '@viewmodels/auth.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import { AuthenticatedUser } from '@utils/decorators/authenticate-user.decorator';
import { UserAccess } from '@utils/decorators/user-access.decorator';
import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @SerializeResponse({ vm: AuthLoginVm })
  @Post('login')
  async login(@Body() body: AuthLoginRequest) {
    return await this.service.login(body);
  }

  @ApiOperation({ summary: 'Register' })
  @SerializeResponse({ vm: AuthRegisterVm })
  @Post('register')
  async register(@Body() body: AuthRegisterRequest) {
    return await this.service.register(body);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @SerializeResponse({ vm: RefreshTokenVm })
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenRequest) {
    return await this.service.refreshToken(body);
  }

  @ApiOperation({ summary: 'Logout (Revoke Refresh Token)' })
  @SerializeResponse({ vm: Object, hasMessage: true })
  @Post('logout')
  async logout(@Body() body: RefreshTokenRequest) {
    await this.service.logout(body.refreshToken);
    return { message: 'Successfully logged out' };
  }

  @ApiOperation({ summary: 'Logout from All Devices' })
  @AuthenticatedUser()
  @SerializeResponse({ vm: Object, hasMessage: true })
  @Post('logout-all')
  async logoutAll(@UserAccess() user: User) {
    await this.service.logoutAll(user.id);
    return { message: 'Successfully logged out from all devices' };
  }
}
