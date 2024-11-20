import { GrpcStatusCode, RpcExceptionResponse } from '@app/interfaces';
import { HttpException } from '@nestjs/common';

export class GrpcException extends HttpException {
  private static statusMapping = {
    [GrpcStatusCode.NOT_FOUND]: 404,
    [GrpcStatusCode.INTERNAL]: 500,
    [GrpcStatusCode.INVALID_ARGUMENT]: 400,
    [GrpcStatusCode.PERMISSION_DENIED]: 403,
    [GrpcStatusCode.ALREADY_EXISTS]: 409,
    [GrpcStatusCode.DEADLINE_EXCEEDED]: 504,
  };

  constructor(error: RpcExceptionResponse) {
    const httpStatus = GrpcException.statusMapping[error.code] || 500;
    super(
      {
        message: error.message,
        details: error.details,
        metadata: error.metadata,
      },
      httpStatus,
    );
  }
}
