import type { RedisOptions } from 'ioredis';
import IORedis from 'ioredis';

import type { BaseClientOptions } from './types';

export interface RedisConfig {
  REDIS_CLUSTER_HOST: string;
  REDIS_CLUSTER_PORT: number;
}

export interface RedisClientOptions extends BaseClientOptions<RedisConfig> {
  lazyConnect?: boolean;
}

export class Redis extends IORedis {
  setup() {
    return super.connect();
  }

  destroy() {
    return this.quit();
  }

  duplicate(override: Partial<RedisOptions> = {}): Redis {
    return new Redis({ ...this.options, ...override });
  }
}

export const RedisClient = ({ config, lazyConnect }: RedisClientOptions): Redis =>
  new Redis({
    port: config.REDIS_CLUSTER_PORT,
    host: config.REDIS_CLUSTER_HOST,
    lazyConnect,
  });
