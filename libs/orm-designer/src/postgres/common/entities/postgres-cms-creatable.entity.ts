import { Property } from '@mikro-orm/core';

import type { EntityCreateParams } from '@/types';

import { PostgresCMSEntity } from './postgres-cms.entity';

export abstract class PostgresCMSCreatableEntity extends PostgresCMSEntity {
  @Property({ defaultRaw: 'now()' })
  createdAt: Date;

  constructor({ createdAt = new Date().toJSON(), ...data }: EntityCreateParams<PostgresCMSCreatableEntity>) {
    super(data);

    this.createdAt = new Date(createdAt);
  }
}
