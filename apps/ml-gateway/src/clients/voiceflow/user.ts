import { User } from '@voiceflow/socket-utils';

import logger from '@/logger';

import { ExtraOptions } from '../types';

export interface UserClient {
  get: () => Promise<User | null>;
}

const Client = ({ api }: ExtraOptions): UserClient => ({
  get: () =>
    api
      .get<User | null>('/user')
      .then(({ data }) => data)
      .catch((err) => {
        logger.debug(err);

        return null;
      }),
});

export default Client;
