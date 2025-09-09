import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthRegisterRequest {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
