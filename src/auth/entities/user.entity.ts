import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @Column('text', {
    unique: true,
  })
  email!: string;

  @ApiHideProperty()
  @Column('text', {
    select: false,
  })
  password!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  @Column('text')
  fullName!: string;

  @ApiProperty({ example: true })
  @Column('bool', {
    default: true,
  })
  isActive!: boolean;

  @ApiProperty({ type: [String], example: ['user'] })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles!: string[];

  @ApiHideProperty()
  @OneToMany(() => Product, (product) => product.user)
  product?: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLocaleLowerCase().trim();
  }
}
