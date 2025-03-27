import { IsOptional, IsString } from 'class-validator';

export class CreateAuditLogRequest {
  @IsString()
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

export class SearchAuditLogRequest {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
