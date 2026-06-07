import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    
    private readonly productRepository: Repository <Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try {
        console.log('ENTRO AL SERVICE');
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    }catch (error){

     this.handleDBException(error);
    }
 
  }

  findAll(paginationDto: PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`producto id ${id} not found`);

    return product ;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove( product );
    return product;
  }
  
  private handleDBException(error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
      
    this.logger.error(error);
    throw new InternalServerErrorException('check server logs');
  }

}
