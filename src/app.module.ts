import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SeedModule } from './seed/seed.module';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        password: configService.get('DB_PASSWORD'),
        username: configService.get('DB_USERNAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        logging: true,
      }),
    }),
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    const client = cacheManager.store.getClient();
    client.on('error', () => {});
  }
}
