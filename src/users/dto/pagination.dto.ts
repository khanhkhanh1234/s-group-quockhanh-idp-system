import { IsOptional, IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber: number;
}
