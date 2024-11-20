import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { DatabaseModule } from '@app/database';
import { HelperModule } from '@app/helper';

@Module({
  imports: [HelperModule, DatabaseModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
