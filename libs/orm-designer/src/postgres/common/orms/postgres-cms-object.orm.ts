import type { CMSObjectORM } from '@/common';
import type { Constructor, EntityObject, MutableEntityData, ORMMutateOptions, PKOrEntity } from '@/types';

import type { PostgresCMSObjectEntity } from '../entities/postgres-cms-object.entity';
import { PostgresCMSMutableORM } from './postgres-cms-mutable.orm';

export const PostgresCMSObjectORM = <Entity extends PostgresCMSObjectEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: Partial<MutableEntityData<Entity>>) => Partial<EntityObject<Entity>>;
  }
) =>
  class
    extends PostgresCMSMutableORM<Entity, ConstructorParam>(Entity)
    implements CMSObjectORM<Entity, ConstructorParam>
  {
    createOneForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>,
      options?: ORMMutateOptions
    ): Promise<Entity> {
      return this.createOne({ ...data, updatedByID: userID } as ConstructorParam, options);
    }

    createManyForUser(
      userID: number,
      data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>[],
      options?: ORMMutateOptions
    ): Promise<Entity[]> {
      return this.createMany(
        data.map((item) => ({ ...item, updatedByID: userID } as ConstructorParam)),
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
