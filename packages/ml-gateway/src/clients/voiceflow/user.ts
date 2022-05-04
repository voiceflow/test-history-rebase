import { User } from '@voiceflow/socket-utils';

import logger from '@/logger';

import { ExtraOptions } from './types';

const Client = ({ api }: ExtraOptions) => ({
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

export type UserClient = ReturnType<typeof Client>;
