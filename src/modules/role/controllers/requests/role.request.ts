import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class FilterSearchRole {
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateRoleRequest {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

export class UpdateRoleRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}
