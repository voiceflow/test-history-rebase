import type { MutableORM } from '@/common';
import { isEntity } from '@/common/utils';
import type {
  Constructor,
  EntityObject,
  MutableEntityData,
  ORMDeleteOptions,
  ORMMutateOptions,
  PKOrEntity,
  PrimaryObject,
} from '@/types';

import type { MongoEntity } from './entities/mongo.entity';
import { MongoORM } from './mongo.orm';

export const MongoMutableORM = <Entity extends MongoEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: MutableEntityData<Entity>) => Partial<EntityObject<Entity>>;
  }
) =>
  class extends MongoORM<Entity, ConstructorParam>(Entity) implements MutableORM<Entity, ConstructorParam> {
    async patchOne(
      entity: PKOrEntity<Entity>,
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ) {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      Object.assign(entityRef, Entity.fromJSON(patch));

      if (flush) {
        await this.em.flush();
      }
    }

    async patchMany(
      entities: PKOrEntity<Entity>[],
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ) {
      await Promise.all(entities.map((entity) => this.patchOne(entity, patch, { flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }

    async upsertOne(
      data: (MutableEntityData<Entity> & PrimaryObject<Entity>) | (ConstructorParam & PrimaryObject<Entity>),
      { flush = true }: ORMMutateOptions = {}
    ): Promise<Entity> {
      const result = await this.em.upsert(Entity, Entity.fromJSON(data) as Entity);

      if (flush) {
        await this.em.flush();
      }

      return result;
    }

    async upsertMany(
      data: Array<(MutableEntityData<Entity> & PrimaryObject<Entity>) | (ConstructorParam & PrimaryObject<Entity>)>,
      { flush = true }: ORMMutateOptions = {}
    ): Promise<Entity[]> {
      const result = await this.em.upsertMany(
        Entity,
        data.map((item) => Entity.fromJSON(item) as Entity)
      );

      if (flush) {
        await this.em.flush();
      }

      return result;
    }

    async deleteOne(entity: PKOrEntity<Entity>, { flush = true }: ORMDeleteOptions = {}) {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      this.em.remove(entityRef);

      if (flush) {
        await this.em.flush();
      }
    }

    async deleteMany(entities: PKOrEntity<Entity>[], { flush = true }: ORMDeleteOptions = {}) {
      await Promise.all(entities.map((entity) => this.deleteOne(entity, { flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }
  };

export type MongoMutableORM<Entity extends MongoEntity, ConstructorParam extends object> = InstanceType<
  ReturnType<typeof MongoMutableORM<Entity, ConstructorParam>>
>;
