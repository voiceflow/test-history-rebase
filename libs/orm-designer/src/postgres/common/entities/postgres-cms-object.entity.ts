import { Property } from '@mikro-orm/core';

import type { EntityCreateParams } from '@/types';

import { PostgresCMSCreatableEntity } from './postgres-cms-creatable.entity';

export abstract class PostgresCMSObjectEntity extends PostgresCMSCreatableEntity {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date;

  constructor({ updatedAt = new Date().toJSON(), ...data }: EntityCreateParams<PostgresCMSObjectEntity>) {
    super(data);

    this.updatedAt = new Date(updatedAt);
  }
}
