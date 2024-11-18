import { RoleUser } from '../enums/user.enum';
import { Request } from 'express';
import { Socket } from 'socket.io';

export class AuthenticatedUser extends Request {
  user: {
    id: string;
    username: string;
    role: RoleUser;
  };
}

export class AuthenticatedSockerUser extends Socket {
  user: {
    id: string;
    username: string;
    role: RoleUser;
  };
}
