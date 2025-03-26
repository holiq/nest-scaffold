import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogRequest {
  @IsNumber()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  request?: string;

  @IsString()
  @IsOptional()
  exceptions?: string;
}
