import { Redis } from 'ioredis';

import { AnyAdapter, BaseKeyExtractor, CacheOptions } from './types';

abstract class BaseCache<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> {
  protected redis: Redis;

  protected adapter?: AnyAdapter;

  protected keyCreator: BaseKeyExtractor;

  constructor({ redis, adapter, keyCreator }: CacheOptions<K, A>) {
    this.redis = redis;

    this.adapter = adapter;
    this.keyCreator = keyCreator;
  }
}

export default BaseCache;
