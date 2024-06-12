import { ObjectId } from '@mikro-orm/mongodb';

import type { CreateData, DEFAULT_OR_NULL_COLUMN, PostgresPKEntity } from '@/types';

import { PostgresMutableORM } from './postgres-mutable.orm';

export abstract class PostgresObjectIDMutableORM<
  BaseEntity extends Omit<PostgresPKEntity & { id: string }, typeof DEFAULT_OR_NULL_COLUMN>,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity,
> extends PostgresMutableORM<BaseEntity, DiscriminatorEntity> {
  protected override async _insertMany(data: CreateData<DiscriminatorEntity>[], options?: { upsert?: boolean }) {
    return super._insertMany(
      data.map((item: any) => ({ ...item, id: item.id ?? new ObjectId().toJSON() })),
      options
    );
  }
}
