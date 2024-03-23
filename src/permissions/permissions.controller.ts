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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionGuard } from 'src/auth/guard/permissions-guard';
import { GuardWithoutLibrary } from 'src/auth/guard/jwt-without-library.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['create:permissions'])
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:permissions'])
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:permissions'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['update:permissions'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['delete:permissions'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
  @Get('roles/')
  getPermissionByRolesName(roles: string[]) {
    return this.permissionsService.getPermissionByRolesName(roles);
  }
}
