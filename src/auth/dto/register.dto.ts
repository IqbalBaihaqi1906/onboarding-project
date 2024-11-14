import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { RoleUser } from '../types/auth.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn([RoleUser.ADMIN, RoleUser.CUSTOMER])
  @IsNotEmpty()
  role: RoleUser = RoleUser.CUSTOMER;
}
