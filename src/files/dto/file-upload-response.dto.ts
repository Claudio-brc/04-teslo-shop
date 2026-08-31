import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    example: 'http://localhost:3001/api/files/product/generated-image-name.jpg',
    description: 'Public URL of the uploaded product image',
  })
  secureUrl!: string;
}
