import { Property } from '@mikro-orm/core';

import { PostgresMutableEntity } from './postgres-mutable.entity';

export abstract class PostgresCreatableEntity extends PostgresMutableEntity {
  @Property({ defaultRaw: 'now()', type: 'timestamptz' })
  createdAt: Date = new Date();
}
