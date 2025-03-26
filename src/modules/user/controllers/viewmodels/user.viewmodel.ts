import { Expose, Transform } from 'class-transformer';

export class UserVm {
  @Expose()
  id: string;

  @Expose()
  fullname: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.pivotUserRole && obj.pivotUserRole.length) {
      return obj.pivotUserRole.map(
        (userRole: { role: { name: string } }) => userRole.role?.name,
      );
    } else {
      return [];
    }
  })
  pivotUserRole: string[];
}
