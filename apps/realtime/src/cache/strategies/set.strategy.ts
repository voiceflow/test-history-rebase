import { BaseStrategy } from './base.strategy';
import type { BaseAdapter, BaseKeyExtractor, KeyOptions, StringFromDB, StringToDB } from './strategy.interface';

export class SetStrategy<
  K extends BaseKeyExtractor,
  A extends BaseAdapter | undefined = undefined,
> extends BaseStrategy<K, A> {
  public async add(keyOptions: KeyOptions<K>, value: StringToDB<A>): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValue = this.adapter?.toDB(value) ?? value;

    if (this.expire) {
      const pipeline = this.redis.pipeline().sadd(dbKey, dbValue);

      await this.setExpireInPipeline(pipeline, dbKey);
    } else {
      await this.redis.sadd(dbKey, dbValue);
    }
  }

  public async addMany(keyOptions: KeyOptions<K>, values: StringToDB<A>[]): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValues = values.map((value) => this.adapter?.toDB(value) ?? value);

    if (this.expire) {
      const pipeline = this.redis.pipeline().sadd(dbKey, ...dbValues);

      await this.setExpireInPipeline(pipeline, dbKey);
    } else {
      await this.redis.sadd(dbKey, dbValues);
    }
  }

  public async remove(keyOptions: KeyOptions<K>, value: StringToDB<A>): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValue = this.adapter?.toDB(value) ?? value;

    if (this.expire) {
      const pipeline = this.redis.pipeline().srem(dbKey, dbValue);

      await this.setExpireInPipeline(pipeline, dbKey);
    } else {
      await this.redis.srem(dbKey, dbValue);
    }
  }

  public async removeMany(keyOptions: KeyOptions<K>, values: StringToDB<A>[]): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValues = values.map((value) => this.adapter?.toDB(value) ?? value);

    if (this.expire) {
      const pipeline = this.redis.pipeline().srem(dbKey, ...dbValues);

      await this.setExpireInPipeline(pipeline, dbKey);
    } else {
      await this.redis.srem(dbKey, dbValues);
    }
  }

  public async values(keyOptions: KeyOptions<K>): Promise<StringFromDB<A>[]> {
    const members = await this.redis.smembers(this.keyCreator(keyOptions));

    return this.adapter?.mapFromDB(members) ?? members;
  }

  public async size(keyOptions: KeyOptions<K>): Promise<number> {
    return this.redis.scard(this.keyCreator(keyOptions));
  }
}
