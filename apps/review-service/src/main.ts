import { NestFactory } from '@nestjs/core';
import { ReviewServiceModule } from './review-service.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@app/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(ReviewServiceModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.port ?? 3001);
}

bootstrap();
