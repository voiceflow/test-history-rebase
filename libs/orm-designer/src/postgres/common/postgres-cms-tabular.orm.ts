import type { FilterQuery, FindOptions } from '@mikro-orm/core';

import type { TabularORM } from '@/common';
import type {
  Constructor,
  MutableEntityData,
  ORMMutateOptions,
  PKOrEntity,
  ResolvedForeignKeys,
  ResolveForeignKeysParams,
} from '@/types';

import type { AssistantEntity } from '../assistant';
import type { PostgresCMSTabularEntity } from './entities/postgres-cms-tabular.entity';
import { PostgresCMSMutableORM } from './postgres-cms-mutable.orm';

export const PostgresCMSTabularORM = <Entity extends PostgresCMSTabularEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    resolveForeignKeys: (
      data: ResolveForeignKeysParams<Entity>
    ) => ResolvedForeignKeys<Entity, ResolveForeignKeysParams<Entity>>;
  }
) =>
  class
    extends PostgresCMSMutableORM<Entity, ConstructorParam>(Entity)
    implements TabularORM<Entity, ConstructorParam>
  {
    findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<Entity[]> {
      return this.find(
        { assistant, environmentID } as FilterQuery<Entity>,
        { orderBy: { createdAt: 'DESC' } } as FindOptions<Entity>
      );
    }

    deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
      return this.em.createQueryBuilder(Entity).update({ deletedAt: new Date() }).where({ assistant }).execute();
    }

    createOneForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>,
      options?: ORMMutateOptions
    ): Promise<Entity> {
      return this.createOne({ ...data, createdByID: userID, updatedByID: userID } as ConstructorParam, options);
    }

    createManyForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>[],
      options?: ORMMutateOptions
    ): Promise<Entity[]> {
      return this.createMany(
        data.map((item) => ({ ...item, createdByID: userID, updatedByID: userID } as ConstructorParam)),
        options
      );
    }

    patchOneForUser(
      userID: number,
      id: PKOrEntity<Entity>,
      data: MutableEntityData<Entity>,
      options?: ORMMutateOptions
    ): Promise<void> {
      return this.patchOne(id, { ...data, updatedByID: userID }, options);
    }

    patchManyForUser(
      userID: number,
      ids: PKOrEntity<Entity>[],
      data: MutableEntityData<Entity>,
      options?: ORMMutateOptions
    ): Promise<void> {
      return this.patchMany(ids, { ...data, updatedByID: userID }, options);
    }
  };
