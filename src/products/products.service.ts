import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

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

  async   findOne(term: string) {

    let product: Product | null = null; ;

    if(isUUID(term)){
      product = await this.productRepository.findOneBy({ id: term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug',{
          title: term.toUpperCase(),
           slub: term.toLowerCase()
        }).getOne();
      
     // this.productRepository.findOneBy({ slug: term});
    }

    //const product = await this.productRepository.findOneBy({ term });
    if (!product) throw new NotFoundException(`producto id ${term} not found`);

    return product ;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
     id: id,
     ...updateProductDto      
    });

    if ( !product ) throw new NotFoundException(`producto id: ${id} not found`)

    try{
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBException(error);   
    }



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
