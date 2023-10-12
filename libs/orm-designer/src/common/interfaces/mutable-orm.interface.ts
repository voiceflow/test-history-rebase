import type { MutableEntityData, ORMDeleteOptions, ORMMutateOptions, PKEntity, PKOrEntity } from '@/types';

import type { ORM } from './orm.interface';

export interface MutableORM<Entity extends PKEntity, ConstructorParam extends object>
  extends ORM<Entity, ConstructorParam> {
  patchOne(id: PKOrEntity<Entity>, patch: MutableEntityData<Entity>, options?: ORMMutateOptions): Promise<void>;

  patchMany(ids: PKOrEntity<Entity>[], patch: MutableEntityData<Entity>, options?: ORMMutateOptions): Promise<void>;

  deleteOne(id: PKOrEntity<Entity>, options?: ORMDeleteOptions): Promise<void>;

  deleteMany(ids: PKOrEntity<Entity>[], options?: ORMDeleteOptions): Promise<void>;
}
