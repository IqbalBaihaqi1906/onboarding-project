import { NestFactory } from '@nestjs/core';
import { PgtypedProjectModule } from './pgtyped-project.module';

async function bootstrap() {
  const app = await NestFactory.create(PgtypedProjectModule);
  await app.listen(process.env.port ?? 3000);
}

bootstrap();
