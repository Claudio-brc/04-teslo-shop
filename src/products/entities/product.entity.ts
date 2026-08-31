import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Product Id',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 't-shirt teslo',
    description: 'Product Title',
  })
  @Column('text', {
    unique: true,
  })
  title!: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price!: number;

  @ApiPropertyOptional({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Product Description',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO routes',
  })
  @Column('text', {
    unique: true,
  })
  slug!: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
    minimum: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock!: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
    type: [String],
  })
  @Column('text', {
    array: true,
  })
  sizes!: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
    enum: ['men', 'women', 'kid', 'unisex'],
  })
  @Column('text')
  gender!: string;

  @ApiProperty({ type: [String], example: ['shirt', 'logo'] })
  @Column('text', {
    array: true,
    default: [],
  })
  tags!: string[];

  // images
  @ApiPropertyOptional({ type: () => [ProductImage] })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({ type: () => User })
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }, //carga esta relación en el get
  )
  user!: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }
}
