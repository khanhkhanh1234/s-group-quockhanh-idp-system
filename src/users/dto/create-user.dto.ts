import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsString()
  password?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;
  age?: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  @IsArray()
  roles?: number[];
}
