import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedUsers() {
    const usersToCreate = [];
    for (let i = 0; i < 1000; i++) {
      const updatedAt = new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365),
      );
      usersToCreate.push({
        username: `user${i + 1}`,
        password: `password${i + 1}`,
        email: `user${i + 1}@example.com`,
        fullName: `User ${i + 1} Full Name`,
        birthday: new Date(),
        phoneNumber: `123456789${i}`,
        updatedAt: updatedAt,
      });
    }
    await this.userRepository.save(usersToCreate);
  }
}
