import { Property } from '@mikro-orm/core';

import { PostgresEntity } from './postgres.entity';

export abstract class PostgresMutableEntity extends PostgresEntity {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date(), type: 'timestamptz' })
  updatedAt: Date = new Date();

  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;
}
