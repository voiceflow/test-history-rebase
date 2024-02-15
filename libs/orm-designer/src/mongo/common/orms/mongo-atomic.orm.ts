import { ObjectId } from '@mikro-orm/mongodb';
import type { Filter, FindOneAndUpdateOptions, UpdateOptions } from 'mongodb-mikro';

import type { MutableORM } from '@/common';
import type { Constructor, EntityObject, MutableEntityData, PKOrEntity } from '@/types';

import type * as Atomic from '../atomic';
import type { MongoEntity } from '../entities/mongo.entity';
import { MongoMutableORM } from './mongo-mutable.orm';

export const MongoAtomicORM = <Entity extends MongoEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: MutableEntityData<Entity>) => Partial<EntityObject<Entity>>;
  }
) =>
  class extends MongoMutableORM<Entity, ConstructorParam>(Entity) implements MutableORM<Entity, ConstructorParam> {
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

    getOneFilter(id: PKOrEntity<Entity>): Filter<Entity> {
      if (typeof id === 'object' && '_bsontype' in id) {
        return { _id: id } as Filter<Entity>;
      }

      if (typeof id === 'object') {
        return (id instanceof Entity ? id : Entity.fromJSON(id as MutableEntityData<Entity>)) as Filter<Entity>;
      }

      return { _id: new ObjectId(id) } as Filter<Entity>;
    }

    async atomicUpdate(
      filter: Filter<Entity>,
      updates: Atomic.UpdateOperation<any>[],
      options?: UpdateOptions
    ): Promise<void> {
      const collection = this.em.getCollection<Entity>(Entity);
      const { query, arrayFilters } = this.getAtomicUpdatesFields<Entity>(updates);

      const { matchedCount, acknowledged } = await collection.updateOne(filter, query, {
        ...options,
        arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
      });

      if (!acknowledged) {
        throw new Error(`Count not atomically update "${Entity.name}" entity`);
      }

      if (matchedCount !== 1 && !options?.upsert) {
        throw new Error(`Couldn't find "${Entity.name}" entity or atomically update value is same`);
      }
    }

    async atomicUpdateOne(
      id: PKOrEntity<Entity>,
      updates: Atomic.UpdateOperation<any>[],
      options?: UpdateOptions
    ): Promise<void> {
      return this.atomicUpdate(this.getOneFilter(id), updates, options);
    }

    async findAndAtomicUpdate(
      filter: Filter<Entity>,
      updates: Atomic.UpdateOperation<any>[],
      options?: FindOneAndUpdateOptions
    ): Promise<Entity> {
      const collection = this.em.getCollection<Entity>(Entity);
      const { query, arrayFilters } = this.getAtomicUpdatesFields<Entity>(updates);

      const { value, ok } = await collection.findOneAndUpdate(filter, query, {
        ...options,
        arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
        includeResultMetadata: true,
      });

      if (!ok) {
        throw new Error(`Count not atomically update "${Entity.name}" entity`);
      }

      if (!value) {
        throw new Error(`Couldn't find "${Entity.name}" entity`);
      }

      return value as Entity;
    }

    async findOneAndAtomicUpdate(
      id: PKOrEntity<Entity>,
      updates: Atomic.UpdateOperation<any>[],
      options?: FindOneAndUpdateOptions
    ): Promise<Entity> {
      return this.findAndAtomicUpdate(this.getOneFilter(id), updates, options);
    }
  };

export type MongoAtomicORM<Entity extends MongoEntity, ConstructorParam extends object> = InstanceType<
  ReturnType<typeof MongoAtomicORM<Entity, ConstructorParam>>
>;
