import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly roleService: RolesService,
  ) {}

  async cacheUserRolesAndPermissions(token: string) {
    try {
      const userId = await this.usersService.getUserIdFromToken(token);
      const roles = await this.usersService.getRolesByUserId(userId);
      const permissions =
        await this.permissionsService.getPermissionByRolesName(
          roles.map((role) => role.name),
        );
      await this.cacheManager.set(`user:${userId}`, JSON.stringify(userId));
      // Cache roles and permissions
      await this.cacheManager.set(
        `user:${userId}:roles`,
        JSON.stringify(roles),
      );
      await this.cacheManager.set(
        `user:${userId}:permissions`,
        JSON.stringify(permissions),
      );
    } catch (error) {
      console.error('Error caching user roles and permissions:', error);
      throw new InternalServerErrorException(
        'Failed to cache user roles and permissions',
      );
    }
  }

  async getRolesByUserIdInCache(userId: string): Promise<any> {
    const isRedisLive = await this.isRedisLive();
    if (!isRedisLive) {
      return this.roleService.getRolesByUserId(userId);
    }
    const key = `user:${userId}:roles`;
    return this.cacheManager.get(key);
  }

  async getPermissionsByUserIdInCache(userId: string): Promise<any> {
    const isRedisLive = await this.isRedisLive();
    if (!isRedisLive) {
      const roles = await this.roleService.getRolesByUserId(userId);
      const permissions =
        await this.permissionsService.getPermissionByRolesName(
          roles.map((role) => role.name),
        );
      return permissions;
    }
    const key = `user:${userId}:permissions`;
    return this.cacheManager.get(key);
  }
  isRedisLive() {
    return this.cacheManager.store.getClient().ping();
  }
}
