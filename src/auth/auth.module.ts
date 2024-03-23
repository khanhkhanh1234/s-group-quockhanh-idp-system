import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from 'src/roles/entities/role.entity';
import User from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import Permission from 'src/permissions/entities/permission.entity';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RolesService } from 'src/roles/roles.service';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600000,
    }),
    PermissionsModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PermissionsService, CacheService, RolesService],
  exports: [AuthService],
})
export class AuthModule {}
