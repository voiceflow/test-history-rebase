import { ManyToOne, Property, ref } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { EntityCreateParams, Ref } from '@/types';

import { PostgresCMSCreatableEntity } from './postgres-cms-creatable.entity';

export abstract class PostgresCMSObjectEntity extends PostgresCMSCreatableEntity {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date;

  @ManyToOne(() => UserStubEntity, { name: 'updated_by_id', nullable: true, default: null })
  updatedBy: Ref<UserStubEntity> | null = null;

  constructor({ updatedAt = new Date().toJSON(), updatedByID, ...data }: EntityCreateParams<PostgresCMSObjectEntity>) {
    super(data);

    this.updatedAt = new Date(updatedAt);
    this.updatedBy = updatedByID === null ? null : ref(UserStubEntity, updatedByID);
  }
}
