import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';

const dbProvider = {
  provide: 'DB_CONNECTION',
  useFactory: () => {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
    });
    return pool;
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available globally
    }),
  ],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
