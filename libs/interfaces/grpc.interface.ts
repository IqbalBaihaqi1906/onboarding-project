export interface RpcExceptionResponse {
  code: number;
  message: string;
  details?: any;
  metadata?: Record<string, any>;
}

export enum GrpcStatusCode {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  INTERNAL = 13,
}
