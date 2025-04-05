import { TransformJson } from '@utils/decorators/transform-json.decorator';
import { Expose } from 'class-transformer';

export class AuditLogVm {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  @Expose()
  userEmail: string;

  @Expose()
  @TransformJson()
  request: Record<string, object>;

  @Expose()
  @TransformJson()
  exceptions: Record<string, object>;

  @Expose()
  createdAt: Date;
}
