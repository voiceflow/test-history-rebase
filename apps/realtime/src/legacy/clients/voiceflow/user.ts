import { User } from '@voiceflow/socket-utils';

import { ExtraOptions } from './types';

export interface UserClient {
  get: () => Promise<User | null>;
}

const Client = ({ api, log }: ExtraOptions): UserClient => ({
  get: () =>
    api
      .get<User | null>('/user')
      .then(({ data }) => data)
      .catch((err) => {
        log.debug(err);

        return null;
      }),
});

export default Client;
