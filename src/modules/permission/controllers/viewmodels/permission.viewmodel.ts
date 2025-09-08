import { Expose } from 'class-transformer';

export class PermissionVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
