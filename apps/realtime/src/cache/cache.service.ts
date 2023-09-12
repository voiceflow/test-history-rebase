import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';

import { booleanAdapter } from './adapters/boolean.adapter';
import { jsonAdapter, jsonAdapterFactory } from './adapters/json.adapter';
import { HashStrategy } from './strategies/hash.strategy';
import { KeyValueStrategy } from './strategies/key-value.strategy';
import { SetStrategy } from './strategies/set.strategy';
import type { BaseAdapter, BaseHashAdapter, BaseKeyExtractor, Options } from './strategies/strategy.interface';

export type { Hash } from './strategies/strategy.interface';
export { HashStrategy, KeyValueStrategy, SetStrategy };

@Injectable()
export class CacheService {
  private redis: Redis;

  public adapters = {
    jsonAdapter,
    booleanAdapter,
    jsonAdapterFactory,
  } as const;

  constructor(
    @Inject(RedisService)
    private readonly redisService: RedisService
  ) {
    this.redis = this.redisService.getClient();
  }

  setStrategyFactory<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined>(options: Options<K, A>): SetStrategy<K, A> {
    return new SetStrategy<K, A>({ redis: this.redis, ...options });
  }

  hashStrategyFactory<K extends BaseKeyExtractor, A extends BaseHashAdapter | undefined = undefined>(options: Options<K, A>): HashStrategy<K, A> {
    return new HashStrategy<K, A>({ redis: this.redis, ...options });
  }

  keyValueStrategyFactory<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined>(options: Options<K, A>): KeyValueStrategy<K, A> {
    return new KeyValueStrategy<K, A>({ redis: this.redis, ...options });
  }
}
