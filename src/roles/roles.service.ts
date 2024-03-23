import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import Permission from 'src/permissions/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Role from './entities/role.entity';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.insert(createRoleDto);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: string) {
    return await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: string) {
    return await this.roleRepository.delete(id);
  }
  async updatePermissions(
    roleId: string,
    updatePermissionDto: UpdatePermissionRoleDto,
  ) {
    const { permissionIds } = updatePermissionDto;
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
      relations: ['permissions'],
    });
    if (role) {
      const permissions: Permission[] = [];
      for (const permissionId of permissionIds) {
        const permission = await this.permissionRepository.findOne({
          where: {
            id: permissionId,
          },
        });
        if (permission) {
          permissions.push(permission);
        }
      }
      role.permissions = permissions;
      return await this.roleRepository.save(role);
    } else {
      return new NotFoundException(`Role with id ${roleId} not found`);
    }
  }
  async getRolesByUserId(userId: string) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('user.id = :userId', { userId: userId })
      .getMany();
  }
}
