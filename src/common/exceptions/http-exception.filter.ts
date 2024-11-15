import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseDto } from '../dto/base-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as any;

    const apiResponse: BaseResponseDto = {
      success: false,
      code: status,
      data: null,
      error: {
        message:
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse.message || 'Internal server error',
        details: errorResponse.details || null,
      },
      meta: null,
    };

    response.status(status).json(apiResponse);
  }
}
