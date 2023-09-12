import { BaseStrategy } from './base.strategy';
import type { BaseHashAdapter, BaseKeyExtractor, HashFromDB, HashToDB, KeyOptions } from './strategy.interface';

export class HashStrategy<K extends BaseKeyExtractor, A extends BaseHashAdapter | undefined = undefined> extends BaseStrategy<K, A> {
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

  public async get(keyOptions: KeyOptions<K>): Promise<HashFromDB<A>> {
    const value = await this.redis.hgetall(this.keyCreator(keyOptions));

    return this.adapter?.fromDB(value) ?? value;
  }
}
