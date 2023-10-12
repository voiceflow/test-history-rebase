import { Property } from '@mikro-orm/core';

import { PostgresCMSCreatableEntity } from './postgres-cms-creatable.entity';

export abstract class PostgresCMSObjectEntity extends PostgresCMSCreatableEntity {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      updatedAt: this.updatedAt.toJSON(),
    };
  }
}
