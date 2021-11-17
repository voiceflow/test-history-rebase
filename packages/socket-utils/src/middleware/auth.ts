import type { SocketServer } from '@socket-utils/server';
import { Eventual } from '@voiceflow/common';

// eslint-disable-next-line import/prefer-default-export
export const authenticateUser = (server: SocketServer, validate: (creatorID: number, token: string) => Eventual<boolean>) =>
  server.auth(({ userId, token }) => {
    const creatorID = Number(userId);

    if (Number.isNaN(creatorID)) return false;

    return validate(creatorID, token);
  });
