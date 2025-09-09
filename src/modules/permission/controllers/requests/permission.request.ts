import { IsOptional, IsString } from 'class-validator';

export class FilterSearchPermission {
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreatePermissionRequest {
  @IsString()
  name: string;

  @IsString()
  displayName: string;
}

export class UpdatePermissionRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
