import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { isAbsolute, relative, resolve } from 'path';



@Injectable()
export class FilesService {

    getStaticProductImage ( imageName: string ) {

      const imagesDirectory = resolve(__dirname, '../../static/products');
      const imagePath = resolve(imagesDirectory, imageName);
      const relativeImagePath = relative(imagesDirectory, imagePath);

      if (relativeImagePath.startsWith('..') || isAbsolute(relativeImagePath))
        throw new BadRequestException('Invalid image name');

      if (!existsSync(imagePath))
        throw new BadRequestException(`No product found with image ${imageName}`);
        
      return imagePath;

    }

}
