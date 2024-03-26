import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  UseGuards,
  Patch,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PermissionGuard } from 'src/auth/guard/permissions-guard';
import { GuardWithoutLibrary } from 'src/auth/guard/jwt-without-library.guard';
import { PaginationDto } from './dto/pagination.dto';
import { FilterDto } from './dto/filter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['create:user'])
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.createUser(createUserDto);
    return newUser;
  }
  @Get()
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:user'])
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ): Promise<User[]> {
    const users = await this.usersService.getAllUsers(paginationDto, filterDto);
    return users;
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['read:user'])
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.getUserById(id);
    return user;
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['delete:user'])
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.deleteById(id);
    return user;
  }
  @UseGuards(GuardWithoutLibrary, PermissionGuard)
  @SetMetadata('permissions', ['update:users_roles'])
  @Patch(':id/roles')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return await this.usersService.updateUserRole(id, updateUserRoleDto);
  }
  @Post('seed')
  async seedUsers(): Promise<void> {
    await this.usersService.seedUsers();
  }
  @Get('me')
  @UseGuards(GuardWithoutLibrary)
  async getMe(@Req() req: Request): Promise<any> {
    return await this.usersService.getMe(req);
  }
}
