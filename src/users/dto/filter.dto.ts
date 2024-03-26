import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  search: string;
  @IsOptional()
  name: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsDate()
  fromDate: Date;
  @IsOptional()
  @IsDate()
  toDate: Date;
}
