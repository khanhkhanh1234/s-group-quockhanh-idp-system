import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Permission from 'src/permissions/entities/permission.entity';
import Role from './entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import User from 'src/users/entities/user.entity';
import { CacheService } from 'src/cache/cache.service';
import { UsersService } from 'src/users/users.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  controllers: [RolesController],
  providers: [
    RolesService,
    JwtService,
    CacheService,
    UsersService,
    PermissionsService,
  ],
})
export class RolesModule {}
