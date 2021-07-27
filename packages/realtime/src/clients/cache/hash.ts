import BaseCache from './base';
import { BaseHashAdapter, BaseKeyExtractor, HashFromDB, HashToDB, KeyOptions } from './types';

class HashCache<K extends BaseKeyExtractor, A extends BaseHashAdapter | undefined = undefined> extends BaseCache<K, A> {
  public async set(keyOptions: KeyOptions<K>, value: HashToDB<A>): Promise<void> {
    await this.redis.hset(this.keyCreator(keyOptions), this.adapter?.toDB(value) ?? value);
  }

  public async remove(keyOptions: KeyOptions<K>): Promise<void> {
    await this.redis.del(this.keyCreator(keyOptions));
  }

  public async get(keyOptions: KeyOptions<K>): Promise<HashFromDB<A>> {
    const value = await this.redis.hgetall(this.keyCreator(keyOptions));

    return this.adapter?.fromDB(value) ?? value;
  }
}

export default HashCache;
