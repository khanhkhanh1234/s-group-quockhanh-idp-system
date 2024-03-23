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
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId.toString(),
          },
        });
        if (role) {
          roles.push(role);
        }
      }
      user.roles = roles;
    }
    return this.userRepository.save(user);
  }

  async getAllUsers(pageSize: number = 2000, pageNumber: number = 1) {
    const offset = (pageNumber - 1) * pageSize;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username != :username', { username: 'headadmin' })
      .take(pageSize)
      .skip(offset)
      .getMany();

    return users;
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
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId,
          },
        });
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
      ); // Random date within the past year
      const user: CreateUserDto = {
        username: `user_${i}`,
        fullName: `User ${i} Full Name`,
        password: `password`,
        email: `user${i}@example.com`,
        age: Math.floor(Math.random() * 70) + 18, // Random age between 18 and 87
        updatedAt: randomDate,
        roles: [4], // Default role
      };
      console.log(user);
      await this.createUser(user);
    }
  }
}
