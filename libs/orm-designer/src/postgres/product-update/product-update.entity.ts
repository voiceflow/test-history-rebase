import type { Ref } from '@mikro-orm/core';
import { Entity, OneToOne, Property, Unique } from '@mikro-orm/core';

import { PostgresEntity } from '@/postgres/common';

import { UserStubEntity } from '../stubs/user.stub';

@Entity({ schema: 'public', tableName: 'product_updates' })
@Unique({ properties: ['id'] })
export class ProductUpdateEntity extends PostgresEntity<'type' | 'created' | 'details' | 'creator'> {
  @Property({ name: 'type', nullable: true, type: 'varchar', length: 255 })
  type!: string | null;

  @Property({ defaultRaw: 'now()', nullable: true, type: 'timestamptz' })
  created!: Date | null;

  @Property({ name: 'details', nullable: true, type: 'text' })
  details!: string | null;

  @OneToOne(() => UserStubEntity, { name: 'creator_id' })
  creator!: Ref<UserStubEntity> | null;
}
