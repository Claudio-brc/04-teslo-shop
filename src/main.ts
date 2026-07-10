import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstap');

  app.useGlobalPipes(  
  new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
  }) 
);
  
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
  logger.log(`App running on port ${ process.env.PORT }`);
}
bootstrap();
