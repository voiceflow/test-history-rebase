import axios, { AxiosStatic } from 'axios';

import ApiClient, { Api } from './api';
import RedisClient, { Redis } from './redis';
import { BaseOptions } from './types';

export type ClientMap = {
  api: Api;
  redis: Redis;
  axios: AxiosStatic;
};

const buildClients = ({ config }: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient({ config });
  const api = ApiClient({ axios, config });

  return {
    ...staticClients,
    api,
    redis,
  };
};

export default buildClients;
