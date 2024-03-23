import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/users/entities/user.entity';
import { LoginCredentials, TokenDto } from './interface/interface';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginCredentials> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    const payload = {
      id: user.id,
    };
    const token = this.jwtService.sign(payload);
    const isRedisLive = this.cacheService.isRedisLive();
    if (isRedisLive) {
      await this.cacheService.cacheUserRolesAndPermissions(token);
    }
    const tokenDto: TokenDto = {
      type: 'Bearer',
      name: 'access_token',
      value: (await token).toString(),
    };
    const loginCredentials: LoginCredentials = {
      tokens: [tokenDto],
    };
    return loginCredentials;
  }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user;
  }
}
