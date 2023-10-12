import type { MutableORM } from '@/common';
import type { BaseEntity } from '@/common/interfaces/base-entity.interface';
import { isEntity } from '@/common/utils';
import type {
  Constructor,
  MutableEntityData,
  ORMDeleteOptions,
  ORMMutateOptions,
  PKOrEntity,
  ResolvedForeignKeys,
  ResolveForeignKeysParams,
} from '@/types';

import { PostgresORM } from './postgres.orm';

export const PostgresMutableORM = <
  Entity extends BaseEntity & { deletedAt: Date | null },
  ConstructorParam extends object
>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    resolveForeignKeys: (
      data: ResolveForeignKeysParams<Entity>
    ) => ResolvedForeignKeys<Entity, ResolveForeignKeysParams<Entity>>;
  }
) =>
  class extends PostgresORM<Entity, ConstructorParam>(Entity) implements MutableORM<Entity, ConstructorParam> {
    async patchOne(
      entity: PKOrEntity<Entity>,
      patch: MutableEntityData<Entity>,
      { flush = true }: ORMMutateOptions = {}
    ): Promise<void> {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      Object.assign(entityRef, Entity.resolveForeignKeys(patch as ResolveForeignKeysParams<Entity>));

      if (flush) {
        await this.em.flush();
      }
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

    async deleteOne(entity: PKOrEntity<Entity>, { soft = true, flush = true }: ORMDeleteOptions = {}): Promise<void> {
      const entityRef = isEntity(entity) ? entity : this.getReference(entity);

      if (soft) {
        entityRef.deletedAt = new Date();
      } else {
        this.em.remove(entityRef);
      }

      if (flush) {
        await this.em.flush();
      }
    }

    async deleteMany(
      entities: PKOrEntity<Entity>[],
      { soft = true, flush = true }: ORMDeleteOptions = {}
    ): Promise<void> {
      await Promise.all(entities.map((entity) => this.deleteOne(entity, { soft, flush: false })));

      if (flush) {
        await this.em.flush();
      }
    }
  };
