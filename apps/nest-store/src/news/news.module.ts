import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { HelperModule } from '../common/helper/helper.module';
import { DbModule } from '../common/database-connection/postgres/database.module';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [HelperModule, DatabaseModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
