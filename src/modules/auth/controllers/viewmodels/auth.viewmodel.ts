import { Expose } from 'class-transformer';

export class AuthLoginVm {
  @Expose()
  token: string;

  @Expose()
  expiresIn: number;
}

export class AuthRegisterVm {
  @Expose()
  fullname: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}
