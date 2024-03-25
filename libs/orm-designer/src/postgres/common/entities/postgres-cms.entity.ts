import { PrimaryKey } from '@mikro-orm/core';

import type { PostgresPKEntity } from '@/types';

import { PostgresAbstractEntity } from './postgres-abstract.entity';

export abstract class PostgresCMSEntity<DefaultOrNullColumn extends string = never>
  extends PostgresAbstractEntity<DefaultOrNullColumn | 'id'>
  implements PostgresPKEntity
{
  @PrimaryKey({ type: 'varchar', nullable: false, length: 24 })
  id!: string;
}
