import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HelperService } from '@app/helper';
import { BaseResponseDto, EnumLogStatus } from '@app/dto';
import { LogTypeEnum } from '@app/enums';
import { RedisService } from '@app/redis';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB_CONNECTION') private conn: Pool,
    private helper: HelperService,
    private jwtService: JwtService,
    private redisClient: RedisService,
  ) {}

  async register(registerDto: RegisterDto): Promise<BaseResponseDto> {
    try {
      const { username, password, role } = registerDto;

      await this.validateUsername(username);

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const result: QueryResult<any> = await this.conn.query(
        'INSERT INTO users (username, password, role, id) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, hashedPassword, role, uuidv4()],
      );

      const response: BaseResponseDto = this.helper.transformToResponse(
        {
          id: result.rows[0].id,
          username: result.rows[0].username,
        },
        201,
      );

      // Log user activity
      await this.helper.log(
        LogTypeEnum.userActivity,
        `User ${username} registered`,
        new Date().toISOString(),
        'POST',
        '/auth/register',
        EnumLogStatus.SUCCESS,
      );

      return response;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        e.message || 'Internal server error',
        e.status || 500,
      );
    }
  }

  async validateUsername(username: string): Promise<void> {
    const result: QueryResult<any> = await this.conn.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );

    if (result.rows.length) {
      throw new BadRequestException('Username already exists');
    }
  }

  async login(loginDto: LoginDto): Promise<BaseResponseDto> {
    try {
      const { username, password } = loginDto;

      const user = await this.getUserByUsername(username);

      const isMatch: boolean = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new BadRequestException('Invalid credentials');
      }

      const accessToken: string = await this.jwtService.signAsync(
        {
          username: user.username,
          id: user.id,
          role: user.role,
        },
        { expiresIn: '30d' },
      );

      const response: BaseResponseDto = this.helper.transformToResponse(
        {
          accessToken,
        },
        200,
      );

      // remove from redis
      await this.redisClient.delete(`user:${user.id}`);

      await Promise.all([
        // Log user activity
        this.helper.log(
          LogTypeEnum.userActivity,
          `User ${username} logged in`,
          new Date().toISOString(),
          'POST',
          '/auth/login',
          EnumLogStatus.SUCCESS,
        ),
        // Save access token to redis
        this.redisClient.setWithExpiry(`user:${user.id}`, accessToken, 3600),
      ]);
      return response;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        e.message || 'Internal Server Error',
        e.status || 500,
      );
    }
  }

  async getUserByUsername(
    username: string,
  ): Promise<{ id: string; username: string; password: string; role: string }> {
    const result: QueryResult<any> = await this.conn.query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username],
    );

    if (!result.rows.length) {
      throw new BadRequestException('User not found');
    }

    return result.rows[0];
  }

  async validateUser(id: string): Promise<void> {
    // const result: QueryResult<any> = await this.conn.query(
    //   'SELECT * FROM users WHERE id = $1',
    //   [id],
    // );

    const accessToken: string = await this.redisClient.get(`user:${id}`);

    if (!accessToken) {
      throw new HttpException(
        {
          message: 'Unauthorized',
          details: ['Invalid token'],
        },
        401,
      );
    }
  }
}
