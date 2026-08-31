import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or a unique field already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiOkResponse({
    description: 'Paginated product list',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Pagination parameters are invalid' })
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find a product by UUID, slug, or title' })
  @ApiParam({
    name: 'term',
    description: 'Product UUID, slug, or exact title',
    example: 'teslo-logo-t-shirt',
  })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product was not found' })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.user)
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product UUID', format: 'uuid' })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or a unique field already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  @ApiForbiddenResponse({ description: 'User lacks the required role' })
  @ApiNotFoundResponse({ description: 'Product was not found' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product UUID', format: 'uuid' })
  @ApiOkResponse({
    description: 'Deleted product',
    type: Product,
  })
  @ApiBadRequestResponse({ description: 'The product ID is not a valid UUID' })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  @ApiForbiddenResponse({ description: 'User lacks the admin role' })
  @ApiNotFoundResponse({ description: 'Product was not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
