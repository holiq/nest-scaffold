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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { RoleService } from '../services/role.service';
import { RoleVm } from '@viewmodels/role.viewmodel';
import { SerializeResponse } from '@utils/decorators/response/serialize-response.decorator';
import {
  AuthenticatedUser,
  AuthenticatedAdmin,
} from '@utils/decorators/authenticate-user.decorator';
import { Permission } from '@utils/decorators/permission.decorator';
import { PrismaFilter } from '@utils/decorators/base-filter.decorator';
import {
  FilterSearchRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@requests/role.request';

@ApiTags('(Role) Role Management')
@AuthenticatedUser()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @SerializeResponse({ vm: RoleVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['create_roles'])
  @Post()
  async create(@Body() createRoleRequest: CreateRoleRequest) {
    return this.roleService.create(createRoleRequest);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @SerializeResponse({ vm: RoleVm, type: 'pagination', hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['read_roles'])
  @Get()
  async findAll(
    @PrismaFilter() filter: Prisma.RoleFindManyArgs,
    @Query() query: FilterSearchRole,
  ) {
    return this.roleService.findAll(filter, query);
  }

  @ApiOperation({ summary: 'Get a role by ID' })
  @SerializeResponse({ vm: RoleVm })
  @AuthenticatedAdmin()
  @Permission(['read_roles'])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a role' })
  @SerializeResponse({ vm: RoleVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['update_roles'])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleRequest: UpdateRoleRequest,
  ) {
    return this.roleService.update(id, updateRoleRequest);
  }

  @ApiOperation({ summary: 'Delete a role' })
  @SerializeResponse({ vm: RoleVm, hasMessage: true })
  @AuthenticatedAdmin()
  @Permission(['delete_roles'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
