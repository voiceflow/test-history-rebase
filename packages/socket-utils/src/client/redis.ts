import IORedis from 'ioredis';

import { BaseClientOptions } from './types';

export type Redis = IORedis.Redis;

export interface RedisConfig {
  REDIS_CLUSTER_HOST: string;
  REDIS_CLUSTER_PORT: number;
}

export type RedisClientOptions = BaseClientOptions<RedisConfig>;

export const RedisClient = ({ config }: RedisClientOptions): Redis => new IORedis(config.REDIS_CLUSTER_PORT, config.REDIS_CLUSTER_HOST);
