import { ChainableCommander, Redis } from 'ioredis';

import { AnyAdapter, BaseKeyExtractor, CacheOptions, KeyOptions } from './types';

abstract class BaseCache<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> {
  protected redis: Redis;

  protected expire?: number;

  protected adapter?: AnyAdapter;

  protected keyCreator: BaseKeyExtractor;

  constructor({ redis, expire, adapter, keyCreator }: CacheOptions<K, A>) {
    this.redis = redis;
    this.expire = expire;

    this.adapter = adapter;
    this.keyCreator = keyCreator;
  }

  protected async setExpireInPipeline(
    pipeline: ChainableCommander,
    keys: string | string[],
    { expire = this.expire }: { expire?: number } = {}
  ): Promise<void> {
    const keysToExpire = Array.isArray(keys) ? keys : [keys];

    if (!expire || !keysToExpire.length) {
      return;
    }

    keysToExpire.forEach((key) => pipeline.expire(key, expire));

    await pipeline.exec();
  }

  public async unlink(keyOptions: KeyOptions<K> | KeyOptions<K>[]): Promise<void> {
    const options = Array.isArray(keyOptions) ? keyOptions : [keyOptions];
    const keys = options.map(this.keyCreator);

    if (!keys.length) {
      return;
    }

    await this.redis.unlink(keys);
  }

  public async renewExpire(keyOptions: KeyOptions<K> | KeyOptions<K>[]): Promise<void> {
    const options = Array.isArray(keyOptions) ? keyOptions : [keyOptions];
    const keys = options.map(this.keyCreator);

    if (!keys.length || !this.expire) {
      return;
    }

    if (keys.length === 1) {
      await this.redis.expire(keys[0], this.expire);
    } else {
      await this.setExpireInPipeline(this.redis.pipeline(), keys);
    }
  }
}

export default BaseCache;
