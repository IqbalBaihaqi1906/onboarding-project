import { Body, Controller, Post, Sse } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { map, Observable } from "rxjs";
import { News } from "./news.entity";

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Post('/')
  async createNews(@Body() news: CreateNewsDto): Promise<BaseResponseDto> {
    return this.newsService.create(news);
  }

  @Public()
  @Sse('subscribe')
  subscribeToNews(): Observable<{ data: News[] }> {
    return this.newsService
      .subscribeToNews()
      .pipe(map((news) => ({ data: news })));
  }
}