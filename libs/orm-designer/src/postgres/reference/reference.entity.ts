import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { ReferenceMetadata } from '@voiceflow/dtos';

import { Environment, PostgresAbstractEntity } from '@/postgres/common';
import type { Ref } from '@/types';

import { ReferenceResourceEntity } from './reference-resource/reference-resource.entity';

@Entity({ schema: 'designer', tableName: 'reference' })
export class ReferenceEntity extends PostgresAbstractEntity {
  @Environment()
  environmentID!: string;

  @PrimaryKey({ type: 'varchar', nullable: false, length: 24 })
  id!: string;

  @ManyToOne(() => ReferenceResourceEntity, {
    name: 'resource_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'resource_id'],
  })
  resource!: Ref<ReferenceResourceEntity>;

  @Property({ type: 'jsonb', nullable: true, default: null })
  metadata!: ReferenceMetadata | null;

  @ManyToOne(() => ReferenceResourceEntity, {
    name: 'referrer_resource_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'referrer_resource_id'],
  })
  referrerResource!: Ref<ReferenceResourceEntity>;

  [PrimaryKeyType]?: { environmentID: string; id: string };
}
