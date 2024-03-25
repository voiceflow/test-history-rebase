import type { ToJSON, ToObject } from '@/types';

import { CreatedAt } from '../decorators/created-at.decorator';
import { PostgresMutableEntity } from './postgres-mutable.entity';

export abstract class PostgresCreatableEntity<DefaultOrNullColumn extends string = never> extends PostgresMutableEntity<
  DefaultOrNullColumn | 'createdAt'
> {
  @CreatedAt({ type: 'timestamptz' })
  createdAt!: Date;
}

export type PostgresCreatableObject = ToObject<PostgresCreatableEntity>;
export type PostgresCreatableJSON = ToJSON<PostgresCreatableObject>;
