import type { DEFAULT_OR_NULL_COLUMN } from '@/types';

import type { PostgresCMSCreatableEntity } from '../entities/postgres-cms-creatable.entity';
import { PostgresObjectIDMutableORM } from './postgres-object-id-mutable.orm';

export abstract class PostgresCMSMutableORM<
  BaseEntity extends Omit<PostgresCMSCreatableEntity, typeof DEFAULT_OR_NULL_COLUMN>,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity,
> extends PostgresObjectIDMutableORM<BaseEntity, DiscriminatorEntity> {}
