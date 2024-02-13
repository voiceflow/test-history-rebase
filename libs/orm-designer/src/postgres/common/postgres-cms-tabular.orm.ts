import type { FilterQuery, FindOptions } from '@mikro-orm/core';

import type { CMSTabularORM } from '@/common';
import type { Constructor, EntityObject, MutableEntityData, ORMMutateOptions, PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import type { FolderEntity } from '../folder/folder.entity';
import type { PostgresCMSTabularEntity } from './entities/postgres-cms-tabular.entity';
import { PostgresCMSObjectORM } from './postgres-cms-object.orm';

export const PostgresCMSTabularORM = <Entity extends PostgresCMSTabularEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: Partial<MutableEntityData<Entity>>) => Partial<EntityObject<Entity>>;
  }
) =>
  class
    extends PostgresCMSObjectORM<Entity, ConstructorParam>(Entity)
    implements CMSTabularORM<Entity, ConstructorParam>
  {
    findManyByFolders(folders: PKOrEntity<FolderEntity>[]): Promise<Entity[]> {
      return this.find({ folder: folders } as FilterQuery<Entity>);
    }

    findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<Entity[]> {
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
      return super.createOneForUser(userID, { ...data, createdByID: userID }, options);
    }

    createManyForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>[],
      options?: ORMMutateOptions
    ): Promise<Entity[]> {
      return super.createManyForUser(
        userID,
        data.map((item) => ({ ...item, createdByID: userID })),
        options
      );
    }

    async deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string): Promise<void> {
      await this.nativeDelete({ assistant, environmentID } as FilterQuery<Entity>);
    }
  };
