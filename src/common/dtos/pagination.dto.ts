import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    default: 10,
    description: 'Maximum number of products to return',
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    default: 0,
    description: 'Number of products to skip',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;
}
