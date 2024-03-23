import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';
import { PermissionGuard } from 'src/auth/guard/permissions-guard';
import { GuardWithoutLibrary } from 'src/auth/guard/jwt-without-library.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['create:roles'])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  @Get()
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  findAll() {
    return this.rolesService.findAll();
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['update:roles'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['delete:roles'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
  @UseGuards(GuardWithoutLibrary)
  @SetMetadata('permissions', ['update:roles_permissiosns'])
  @Patch(':id/permissions')
  updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionRoleDto,
  ) {
    return this.rolesService.updatePermissions(id, updatePermissionDto);
  }
  @Get(':id/get-roles')
  getRoles(@Param('id') id: string) {
    return this.rolesService.getRolesByUserId(id);
  }
}
