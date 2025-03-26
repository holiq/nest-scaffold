import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services/auth.service';
import { AuthLoginRequest, AuthRegisterRequest } from '@requests/auth.request';
import { AuthLoginVm, AuthRegisterVm } from '@viewmodels/auth.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @SerializeResponse(AuthLoginVm)
  @Post('login')
  async login(@Body() body: AuthLoginRequest) {
    return await this.service.login(body);
  }

  @ApiOperation({ summary: 'Register' })
  @SerializeResponse(AuthRegisterVm)
  @Post('register')
  async register(@Body() body: AuthRegisterRequest) {
    return await this.service.register(body);
  }
}
