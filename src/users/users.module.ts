import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import Role from 'src/roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import Permission from 'src/permissions/entities/permission.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    CacheService,
    PermissionsService,
    RolesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
