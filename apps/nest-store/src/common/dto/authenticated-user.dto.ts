import { RoleUser } from '../enums/user.enum';
import { Request } from 'express';
import { Socket } from 'socket.io';

export interface AuthenticatedUser extends Request {
  user: {
    id: string;
    username: string;
    role: RoleUser;
  };
}

export interface AuthenticatedSockerUser extends Socket {
  user: {
    id: string;
    username: string;
    role: RoleUser;
  };
}
