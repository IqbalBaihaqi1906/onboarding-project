import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { HelperModule } from '../common/helper/helper.module';
import { DbModule } from '../common/database-connection/postgres/database.module';

@Module({
  imports: [HelperModule, DbModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
