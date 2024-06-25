import BaseCache from './base';
import type { BaseHashAdapter, BaseKeyExtractor, HashFromDB, HashToDB, KeyOptions } from './types';

class HashCache<K extends BaseKeyExtractor, A extends BaseHashAdapter | undefined = undefined> extends BaseCache<K, A> {
  public async set(keyOptions: KeyOptions<K>, value: HashToDB<A>): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValue = this.adapter?.toDB(value) ?? value;

    if (this.expire) {
      const pipeline = this.redis.pipeline().hset(dbKey, dbValue);

      await this.setExpireInPipeline(pipeline, dbKey);
    } else {
      await this.redis.hset(dbKey, dbValue);
    }
  }

  public async get(keyOptions: KeyOptions<K>): Promise<HashFromDB<A> | null> {
    const value = await this.redis.hgetall(this.keyCreator(keyOptions));

    if (Object.keys(value).length === 0) return null;

    return this.adapter?.fromDB(value) ?? value;
  }
}

export default HashCache;
