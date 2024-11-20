import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ElasticModule } from '@app/elastic';

@Module({
  imports: [ElasticModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
