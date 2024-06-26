import type { Socket } from 'socket.io';

import type { MiddlewareNext } from '../types';
import { AbstractMiddleware } from '../types';

class AuthMiddleware extends AbstractMiddleware {
  handle = async (socket: Socket, next: MiddlewareNext) => {
    const { auth } = socket.handshake;

    if (!auth.token) {
      next(new Error('init event requires token'));

      return;
    }

    const user = await this.services.user.getByToken(auth.token);

    if (!user) {
      next(new Error('user not found'));

      return;
    }

    Object.assign(socket, { ctx: { user } });

    next();
  };
}

export default AuthMiddleware;
