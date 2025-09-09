import { Expose } from 'class-transformer';

export class AuthLoginVm {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  refreshExpiresIn: number;
}

export class AuthRegisterVm {
  @Expose()
  fullname: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

export class RefreshTokenVm {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  refreshExpiresIn: number;
}
