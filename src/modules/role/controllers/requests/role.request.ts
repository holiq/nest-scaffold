import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterSearchRole {
  @ApiProperty({ required: false, description: 'Search by role name' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateRoleRequest {
  @ApiProperty({ description: 'Role name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Role display name' })
  @IsString()
  displayName: string;

  @ApiProperty({
    required: false,
    description: 'Permission IDs to assign to role',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

export class UpdateRoleRequest {
  @ApiProperty({ required: false, description: 'Role name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Role display name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({
    required: false,
    description: 'Permission IDs to assign to role',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}
