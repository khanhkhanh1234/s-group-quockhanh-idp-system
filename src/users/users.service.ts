import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { PaginationDto } from './dto/pagination.dto';
import { FilterDto } from './dto/filter.dto';
import { query } from 'express';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { roles: roleIds, ...userData } = createUserDto;
    const salt = 10;
    const hashPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashPassword;
    const user = this.userRepository.create(userData);
    if (roleIds && roleIds.length > 0) {
      const roles: Role[] = [];
      for (const roleId of roleIds) {
        const role = await this.roleService.findOne(roleId.toString());
        if (role) {
          roles.push(role);
        }
      }
      user.roles = roles;
    }
    return this.userRepository.save(user);
  }

  async getAllUsers(paginationDto: PaginationDto, filterDto: FilterDto) {
    let { pageNumber, pageSize } = paginationDto || {};
    if (!pageNumber || !pageSize) {
      pageNumber = 1;
      pageSize = 10;
    }
    const { search, name, email, fromDate, toDate } = filterDto || {};
    const offset = (pageNumber - 1) * pageSize;
    const usersQuery = this.userRepository
      .createQueryBuilder('user')
      .where('user.username != :username', { username: 'headadmin' });

    if (search) {
      console.log(search);
      const res = usersQuery.andWhere(
        'user.fullName LIKE :search OR user.email LIKE :search',
        {
          search: `%${search}%`,
        },
      );
      console.log(res);
    }

    if (name) {
      console.log(name);
      usersQuery.andWhere('user.username = :name', { name });
    }
    if (email) {
      usersQuery.andWhere('user.email = :email', { email });
    }
    if (fromDate && toDate) {
      usersQuery.andWhere('user.updatedAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    const result = await usersQuery.take(pageSize).skip(offset).getMany();

    return result;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
  async getMe(req) {
    console.log(req.headers.authorization);
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const userId = await this.getUserIdFromToken(token);
    console.log(userId);
    const user = await this.getUserById(userId);
    const roles = await this.getRolesByUserId(userId);
    return { user, roles };
  }

  async deleteById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return null;
    }
    await this.userRepository.remove(user);
    return user;
  }
  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { roleIds } = updateUserRoleDto;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });
    if (user) {
      const roles: Role[] = [];
      for (const roleId of roleIds) {
        const role = await this.roleService.findOne(roleId.toString());
        if (role) {
          roles.push(role);
        }
      }
      user.roles = roles;
      return await this.userRepository.save(user);
    } else {
      return new NotFoundException(`User with id ${userId} not found`);
    }
  }
  async getRolesByUserId(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['roles'],
    });
    if (user) {
      return user.roles;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
  async getUserIdFromToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.log(payload);
      return payload.id;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async seedUsers(): Promise<void> {
    const usersToCreate = 1000;
    const currentDate = new Date();
    for (let i = 0; i < usersToCreate; i++) {
      const randomDate = new Date(
        currentDate.getTime() - Math.random() * 1000 * 3600 * 24 * 365,
      );
      const user: CreateUserDto = {
        username: `user_${i}`,
        fullName: `User ${i} Full Name`,
        password: `password`,
        email: `user${i}@example.com`,
        age: Math.floor(Math.random() * 70) + 18,
        updatedAt: randomDate,
        roles: [4],
      };
      await this.createUser(user);
    }
  }
}
