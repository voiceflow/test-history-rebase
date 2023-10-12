import { Property } from '@mikro-orm/core';

import { PostgresCMSEntity } from './postgres-cms.entity';

export abstract class PostgresCMSCreatableEntity extends PostgresCMSEntity {
  @Property({ defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({ default: null })
  deletedAt: Date | null = null;

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      createdAt: this.createdAt.toJSON(),
      deletedAt: this.deletedAt?.toJSON() ?? null,
    };
  }
}
