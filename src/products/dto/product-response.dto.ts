import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto';

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Teslo Logo T-Shirt' })
  title!: string;

  @ApiProperty({ example: 35.99 })
  price!: number;

  @ApiPropertyOptional({
    example: 'Comfortable cotton T-shirt with the Teslo logo.',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: 'teslo-logo-t-shirt' })
  slug!: string;

  @ApiProperty({ example: 25, minimum: 0 })
  stock!: number;

  @ApiProperty({ type: [String], example: ['S', 'M', 'L', 'XL'] })
  sizes!: string[];

  @ApiProperty({
    enum: ['men', 'women', 'kid', 'unisex'],
    example: 'unisex',
  })
  gender!: string;

  @ApiProperty({ type: [String], example: ['shirt', 'logo'] })
  tags!: string[];

  @ApiProperty({
    type: [String],
    example: ['products/teslo-shirt-front.jpg'],
  })
  images!: string[];

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;
}
