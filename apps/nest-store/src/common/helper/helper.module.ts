import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ElasticModule } from '../../libs/elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
