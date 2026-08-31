import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import { Auth } from '../auth/decorators';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiPayloadTooLargeResponse,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Download a product image' })
  @ApiParam({
    name: 'imageName',
    description: 'Stored image file name',
    example: 'generated-image-name.jpg',
  })
  @ApiProduces('image/*')
  @ApiOkResponse({
    description: 'Product image binary',
    content: {
      'image/*': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Image name is invalid or the image does not exist',
  })
  findProductImage(
    @Res() res: express.Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @Auth()
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JPG, JPEG, or PNG image, up to 5 MB',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Image uploaded successfully',
    type: FileUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'File is missing or is not a supported image',
  })
  @ApiPayloadTooLargeResponse({ description: 'File exceeds 5 MB' })
  @ApiUnauthorizedResponse({ description: 'Token is missing or invalid' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 5_000_000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image.');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl,
    };
  }
}
