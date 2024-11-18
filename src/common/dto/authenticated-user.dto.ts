import { RoleUser } from '../enums/user.enum';
import { Request } from 'express';

export class AuthenticatedUser extends Request {
  user: {
    id: string;
    username: string;
    role: RoleUser;
  };
}
