import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PermissionService } from '../services/permission.service';
import { PermissionVm } from '@viewmodels/permission.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import {
  AuthenticatedUser,
  AuthenticatedAdmin,
} from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import {
  FilterSearchPermission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from '@requests/permission.request';

@ApiTags('(Permission) Permission Management')
@AuthenticatedUser()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Create a new permission' })
  @SerializeResponse({ vm: PermissionVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['permissions.create'])
  @Post()
  async create(@Body() createPermissionRequest: CreatePermissionRequest) {
    return this.permissionService.create(createPermissionRequest);
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @SerializeResponse({ vm: PermissionVm, type: 'pagination', hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['permissions.view'])
  @Get()
  async findAll(
    @PrismaFilter() filter: Prisma.PermissionFindManyArgs,
    @Query() query: FilterSearchPermission,
  ) {
    return this.permissionService.findAll(filter, query);
  }

  @ApiOperation({ summary: 'Get a permission by ID' })
  @SerializeResponse({ vm: PermissionVm })
  @AuthenticatedAdmin()
  @Permission(['permissions.view'])
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a permission' })
  @SerializeResponse({ vm: PermissionVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['permissions.update'])
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionRequest: UpdatePermissionRequest,
  ) {
    return this.permissionService.update(id, updatePermissionRequest);
  }

  @ApiOperation({ summary: 'Delete a permission' })
  @SerializeResponse({ vm: PermissionVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['permissions.delete'])
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
