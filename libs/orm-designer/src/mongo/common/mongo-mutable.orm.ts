import type { MutableORM } from '@/common';
import { isEntity } from '@/common/utils';
import type { Constructor, MutableEntityData, ORMDeleteOptions, ORMMutateOptions, PKOrEntity } from '@/types';

import type { MongoCreatableEntity } from './entities/mongo-creatable.entity';
import { MongoORM } from './mongo.orm';

export const MongoMutableORM = <Entity extends MongoCreatableEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity>
) =>
  class extends MongoORM<Entity, ConstructorParam>(Entity) implements MutableORM<Entity, ConstructorParam> {
    async patchOne(
      entity: PKOrEntity<Entity>,
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ) {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      Object.assign(entityRef, patch);

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

    async deleteOne(entity: PKOrEntity<Entity>, { soft = true, flush = true }: ORMDeleteOptions = {}) {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      if (soft) {
        entityRef.deletedAt = Date.now();
      } else {
        this.em.remove(entityRef);
      }

      if (flush) {
        await this.em.flush();
      }
    }

    async deleteMany(entities: PKOrEntity<Entity>[], { soft = true, flush = true }: ORMDeleteOptions = {}) {
      await Promise.all(entities.map((entity) => this.deleteOne(entity, { soft, flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }
  };

export type MongoMutableORM<Entity extends MongoCreatableEntity, ConstructorParam extends object> = InstanceType<
  ReturnType<typeof MongoMutableORM<Entity, ConstructorParam>>
>;
