import type { Primary } from '@mikro-orm/core';
import type { Filter, FindOneAndUpdateOptions, UpdateOptions } from 'mongodb-mikro';

import type { MutableORM } from '@/common/interfaces/mutable-orm.interface';
import type { ToObject } from '@/types';

import type * as Atomic from '../atomic';
import type { MongoEntity } from '../entities/mongo.entity';
import { MongoMutableORM } from './mongo-mutable.orm';

export abstract class MongoAtomicORM<
    BaseEntity extends MongoEntity,
    DiscriminatorEntity extends BaseEntity = BaseEntity,
  >
  extends MongoMutableORM<BaseEntity, DiscriminatorEntity>
  implements MutableORM<BaseEntity, DiscriminatorEntity>
{
  getAtomicUpdatesFields<M>(updates: Atomic.UpdateOperation<any>[]) {
    return updates.reduce(
      (acc, update) => ({
        query: {
          ...acc.query,
          [update.operation]: { ...acc.query[update.operation as keyof Filter<M>], ...update.query },
        },
        arrayFilters: [...acc.arrayFilters, ...update.arrayFilters],
      }),
      { query: {} as Filter<M>, arrayFilters: [] as object[] }
    );
  }

  async atomicUpdate(
    filter: Filter<BaseEntity>,
    updates: Atomic.UpdateOperation<any>[],
    options?: UpdateOptions
  ): Promise<void> {
    const { query, arrayFilters } = this.getAtomicUpdatesFields<BaseEntity>(updates);

    const { matchedCount, acknowledged } = await this.collection.updateOne(filter, query, {
      ...options,
      arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
    });

    if (!acknowledged) {
      throw new Error(`Count not atomically update "${this.entityName}" entity`);
    }

    if (matchedCount !== 1 && !options?.upsert) {
      throw new Error(`Couldn't find "${this.entityName}" entity or atomically update value is same`);
    }
  }

  async atomicUpdateOne(
    id: Primary<BaseEntity>,
    updates: Atomic.UpdateOperation<any>[],
    options?: UpdateOptions
  ): Promise<void> {
    await this.atomicUpdate(this.idToFilter(id), updates, options);
  }

  async findAndAtomicUpdate(
    filter: Filter<BaseEntity>,
    updates: Atomic.UpdateOperation<any>[],
    options?: FindOneAndUpdateOptions
  ): Promise<ToObject<BaseEntity>> {
    const { query, arrayFilters } = this.getAtomicUpdatesFields<BaseEntity>(updates);

    const { value, ok } = await this.collection.findOneAndUpdate(filter, query, {
      ...options,
      arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
      includeResultMetadata: true,
    });

    if (!ok) {
      throw new Error(`Count not atomically update "${this.entityName}" entity`);
    }

    if (!value) {
      throw new Error(`Couldn't find "${this.entityName}" entity`);
    }

    return value as ToObject<BaseEntity>;
  }

  async findOneAndAtomicUpdate(
    id: Primary<BaseEntity>,
    updates: Atomic.UpdateOperation<any>[],
    options?: FindOneAndUpdateOptions
  ): Promise<ToObject<BaseEntity>> {
    return this.findAndAtomicUpdate(this.idToFilter(id), updates, options);
  }
}
