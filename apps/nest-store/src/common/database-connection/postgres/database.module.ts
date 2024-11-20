import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const dbProvider = {
  provide: 'DB_CONNECTION_OLD',
  useValue: new Pool({
    user: 'sample_store',
    host: 'localhost',
    database: 'sample_store',
    password: 'sample_store',
    port: 5434,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}