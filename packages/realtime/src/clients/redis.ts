import IORedis from 'ioredis';

import { BaseOptions } from './types';

export type Redis = IORedis.Redis;

const RedisClient = ({ config }: BaseOptions): Redis => new IORedis(config.REDIS_CLUSTER_PORT, config.REDIS_CLUSTER_HOST);

export default RedisClient;
