import { Entity } from '@mikro-orm/core';

import { DEFAULT_OR_NULL_COLUMN } from '@/types';

// @Entity is needed on this empty class otherwise metadata scanning fails
@Entity({ abstract: true })
export abstract class PostgresAbstractEntity<DefaultOrNullColumn extends string = never> {
  [DEFAULT_OR_NULL_COLUMN]?: DefaultOrNullColumn;
}
