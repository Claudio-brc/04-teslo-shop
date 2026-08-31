import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Teslo Logo T-Shirt',
    description: 'Unique product title',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiPropertyOptional({
    example: 'Comfortable cotton T-shirt with the Teslo logo.',
    description: 'Product description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 35.99,
    description: 'Product price',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 'teslo-logo-t-shirt',
    description:
      'Unique URL-friendly product identifier; generated from title if omitted',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Available sizes',
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  sizes!: string[];

  @ApiPropertyOptional({
    example: 25,
    description: 'Available inventory',
    minimum: 0,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    enum: ['men', 'women', 'kid', 'unisex'],
    example: 'unisex',
    description: 'Target gender category',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender!: string;

  @ApiPropertyOptional({
    example: ['shirt', 'logo'],
    description: 'Searchable product tags',
    type: [String],
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    example: ['products/teslo-shirt-front.jpg'],
    description: 'Product image paths or URLs',
    type: [String],
    default: [],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
