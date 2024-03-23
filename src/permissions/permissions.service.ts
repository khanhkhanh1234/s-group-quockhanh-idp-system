import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from 'src/roles/entities/role.entity';
import Permission from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    const permissions = await this.permissionRepository.find();
    return await permissions;
  }

  async findOne(id: string) {
    return await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: string) {
    return await this.permissionRepository.delete(id);
  }
  async getPermissionByRolesName(roles: string[]) {
    const permissions = [];

    for (const roleName of roles) {
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
        relations: ['permissions'],
      });

      if (role) {
        permissions.push(...role.permissions);
      }
    }
    return permissions.map((permission) => permission.name);
  }
}
