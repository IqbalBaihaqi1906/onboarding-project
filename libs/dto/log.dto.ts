import { LogTypeEnum } from '../enums';

export enum EnumLogStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface LogDto {
  type: LogTypeEnum;
  activity: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: EnumLogStatus;
}
