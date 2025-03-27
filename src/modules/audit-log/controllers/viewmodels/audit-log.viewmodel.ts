import { Expose } from 'class-transformer';

export class AuditLogVm {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  @Expose()
  userEmail: string;

  @Expose()
  request: Record<string, any>;

  @Expose()
  exceptions: Record<string, any>;

  @Expose()
  createdAt: Date;
}
