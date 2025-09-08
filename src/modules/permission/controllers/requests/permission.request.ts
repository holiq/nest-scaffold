import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterSearchPermission {
  @ApiProperty({ required: false, description: 'Search by permission name' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreatePermissionRequest {
  @ApiProperty({ description: 'Permission name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Permission display name' })
  @IsString()
  displayName: string;
}

export class UpdatePermissionRequest {
  @ApiProperty({ required: false, description: 'Permission name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Permission display name' })
  @IsOptional()
  @IsString()
  displayName?: string;
}
