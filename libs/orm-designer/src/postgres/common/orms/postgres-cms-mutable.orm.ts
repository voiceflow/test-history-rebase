import { ObjectId } from '@mikro-orm/mongodb';

import type { CreateData, DEFAULT_OR_NULL_COLUMN } from '@/types';

import type { PostgresCMSCreatableEntity } from '../entities/postgres-cms-creatable.entity';
import { PostgresMutableORM } from './postgres-mutable.orm';

export abstract class PostgresCMSMutableORM<
  BaseEntity extends Omit<PostgresCMSCreatableEntity, typeof DEFAULT_OR_NULL_COLUMN>,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity
> extends PostgresMutableORM<BaseEntity, DiscriminatorEntity> {
  protected override async _insertMany(data: CreateData<DiscriminatorEntity>[], options?: { upsert?: boolean }) {
    return super._insertMany(
      data.map((item: any) => ({ ...item, id: item.id ?? new ObjectId().toJSON() })),
      options
    );
  }
}
