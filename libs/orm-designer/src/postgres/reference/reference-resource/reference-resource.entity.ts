import { Entity, Enum, PrimaryKey, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import { type ReferenceResourceMetadata, ReferenceResourceType } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/main';
import { Assistant, Environment, PostgresAbstractEntity } from '@/postgres/common';
import type { Ref } from '@/types';

@Entity({ schema: 'designer', tableName: 'reference_resource' })
@Unique({ properties: ['environmentID', 'type', 'diagramID', 'resourceID'] })
export class ReferenceResourceEntity extends PostgresAbstractEntity<'diagramID' | 'metadata'> {
  @Environment()
  environmentID!: string;

  @PrimaryKey({ type: 'varchar', nullable: false, length: 24 })
  id!: string;

  @Enum(() => ReferenceResourceType)
  type!: ReferenceResourceType;

  @Property({ type: 'jsonb', nullable: true, default: null })
  metadata!: ReferenceResourceMetadata | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ name: 'diagram_id', type: 'varchar', length: 24, nullable: true, default: null })
  diagramID!: string | null;

  @Property()
  resourceID!: string;

  [PrimaryKeyType]?: { environmentID: string; id: string };
}
