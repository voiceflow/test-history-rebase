import type {
  MutableEntityData,
  ORMDeleteOptions,
  ORMMutateOptions,
  PKEntity,
  PKOrEntity,
  PrimaryObject,
} from '@/types';

import type { ORM } from './orm.interface';

export interface MutableORM<Entity extends PKEntity, ConstructorParam extends object>
  extends ORM<Entity, ConstructorParam> {
  patchOne(id: PKOrEntity<Entity>, patch: MutableEntityData<Entity>, options?: ORMMutateOptions): Promise<void>;

  patchMany(ids: PKOrEntity<Entity>[], patch: MutableEntityData<Entity>, options?: ORMMutateOptions): Promise<void>;

  upsertOne(
    data: (MutableEntityData<Entity> & PrimaryObject<Entity>) | (ConstructorParam & PrimaryObject<Entity>),
    options?: ORMMutateOptions
  ): Promise<Entity>;

  upsertMany(
    data: Array<(MutableEntityData<Entity> & PrimaryObject<Entity>) | (ConstructorParam & PrimaryObject<Entity>)>,
    options?: ORMMutateOptions
  ): Promise<Entity[]>;

  deleteOne(id: PKOrEntity<Entity>, options?: ORMDeleteOptions): Promise<void>;

  deleteMany(ids: PKOrEntity<Entity>[], options?: ORMDeleteOptions): Promise<void>;
}
