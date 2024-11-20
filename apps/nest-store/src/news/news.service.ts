import { Inject, Injectable } from '@nestjs/common';
import { News } from './news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { interval, Observable, switchMap } from 'rxjs';
import { Pool, QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { HelperService } from '@app/helper';
import { BaseResponseDto } from '@app/dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly helper: HelperService,
    @Inject('DB_CONNECTION') private conn: Pool,
  ) {}

  async create(news: CreateNewsDto): Promise<BaseResponseDto> {
    const newNews: News = {
      id: uuidv4(),
      title: news.title,
      description: news.description,
      createdAt: new Date(),
    };

    const result: QueryResult<any> = await this.conn.query(
      'INSERT INTO news (id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [newNews.id, newNews.title, newNews.description],
    );

    return this.helper.transformToResponse(result.rows[0], 201);
  }

  async getThreeLatestNews(): Promise<News[]> {
    const { rows }: QueryResult<any> = await this.conn.query(
      `SELECT *
       FROM news
       ORDER BY "createdAt" DESC LIMIT 3`,
    );

    return rows;
  }

  subscribeToNews(): Observable<News[]> {
    return interval(5000).pipe(switchMap(() => this.getThreeLatestNews()));
  }
}
