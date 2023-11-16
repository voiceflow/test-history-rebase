import type { MutableORM } from '@/common';
import type { BaseEntity } from '@/common/interfaces/base-entity.interface';
import { isEntity } from '@/common/utils';
import type {
  Constructor,
  EntityObject,
  MutableEntityData,
  ORMDeleteOptions,
  ORMMutateOptions,
  PKOrEntity,
} from '@/types';

import { PostgresORM } from './postgres.orm';

export const PostgresMutableORM = <Entity extends BaseEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: MutableEntityData<Entity>) => Partial<EntityObject<Entity>>;
  }
) =>
  class extends PostgresORM<Entity, ConstructorParam>(Entity) implements MutableORM<Entity, ConstructorParam> {
    async patchOne(
      entity: PKOrEntity<Entity>,
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ): Promise<void> {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      Object.assign(entityRef, Entity.fromJSON(patch));

      if (flush) {
        await this.em.flush();
      }
    }

    createOneForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>,
      options?: ORMMutateOptions
    ): Promise<Entity> {
      return this.createOne({ ...data, createdByID: userID, updatedByID: userID } as ConstructorParam, options);
    }

    async patchMany(
      entities: PKOrEntity<Entity>[],
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ): Promise<void> {
      await Promise.all(entities.map((entity) => this.patchOne(entity, patch, { flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }

    async deleteOne(entity: PKOrEntity<Entity>, { flush = true }: ORMDeleteOptions = {}): Promise<void> {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      this.em.remove(entityRef);

      if (flush) {
        await this.em.flush();
      }
    }

    async deleteMany(entities: PKOrEntity<Entity>[], { flush = true }: ORMDeleteOptions = {}): Promise<void> {
      await Promise.all(entities.map((entity) => this.deleteOne(entity, { flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }
  };
