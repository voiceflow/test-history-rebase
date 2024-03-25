import { ManyToOne, Property } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { Ref, ToJSON, ToObject } from '@/types';

import { PostgresCMSCreatableEntity } from './postgres-cms-creatable.entity';

export abstract class PostgresCMSObjectEntity<
  DefaultOrNullColumn extends string = never
> extends PostgresCMSCreatableEntity<DefaultOrNullColumn | 'updatedAt' | 'updatedBy'> {
  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt!: Date;

  @ManyToOne(() => UserStubEntity, { name: 'updated_by_id', nullable: true, default: null })
  updatedBy!: Ref<UserStubEntity> | null;
}

export type PostgresCMSObjectObject = ToObject<PostgresCMSObjectEntity>;
export type PostgresCMSObjectJSON = ToJSON<PostgresCMSObjectObject>;
