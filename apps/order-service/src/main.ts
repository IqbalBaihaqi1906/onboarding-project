import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderServiceModule, {
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: join(process.cwd(), 'proto', 'order.proto'),
      url: 'localhost:5001',
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  app.listen().then(() => {
    console.log('gRPC Microservice is listening on localhost:5001');
  });
}

bootstrap();
