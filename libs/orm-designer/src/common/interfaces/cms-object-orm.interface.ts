import type { MutableEntityData, ORMMutateOptions, PKEntity, PKOrEntity } from '@/types';

import type { MutableORM } from './mutable-orm.interface';

export interface CMSObjectORM<Entity extends PKEntity, ConstructorParam extends object>
  extends MutableORM<Entity, ConstructorParam> {
  createOneForUser(
    userID: number,
    data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>,
    options?: ORMMutateOptions
  ): Promise<Entity>;

  createManyForUser(
    userID: number,
    data: Omit<ConstructorParam, 'createdByID' | 'updatedByID'>[],
    options?: ORMMutateOptions
  ): Promise<Entity[]>;

  patchOneForUser(
    userID: number,
    id: PKOrEntity<Entity>,
    data: MutableEntityData<Entity>,
    options?: ORMMutateOptions
  ): Promise<void>;

  patchManyForUser(
    userID: number,
    ids: PKOrEntity<Entity>[],
    data: MutableEntityData<Entity>,
    options?: ORMMutateOptions
  ): Promise<void>;
}
