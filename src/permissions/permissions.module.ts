import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import Permission from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from 'src/roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/entities/user.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    JwtService,
    CacheService,
    UsersService,
    RolesService,
  ],
})
export class PermissionsModule {}
