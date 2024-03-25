import { Property } from '@mikro-orm/core';

import type { ToJSON, ToObject } from '@/types';

import { PostgresEntity } from './postgres.entity';

export abstract class PostgresMutableEntity<DefaultOrNullColumn extends string = never> extends PostgresEntity<
  DefaultOrNullColumn | 'updatedAt'
> {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date(), type: 'timestamptz' })
  updatedAt!: Date;
}

export type PostgresMutableObject = ToObject<PostgresMutableEntity>;
export type PostgresMutableJSON = ToJSON<PostgresMutableObject>;
