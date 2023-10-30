import type { FilterQuery, FindOptions } from '@mikro-orm/core';

import type { TabularORM } from '@/common';
import type { Constructor, EntityObject, MutableEntityData, ORMMutateOptions, PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import type { PostgresCMSTabularEntity } from './entities/postgres-cms-tabular.entity';
import { PostgresCMSMutableORM } from './postgres-cms-mutable.orm';

export const PostgresCMSTabularORM = <Entity extends PostgresCMSTabularEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: Partial<MutableEntityData<Entity>>) => Partial<EntityObject<Entity>>;
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
