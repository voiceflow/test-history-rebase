import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import { VariableEntity } from '@/postgres/variable';
import type { CMSCompositePK, Ref } from '@/types';

import { EventEntity } from '../event.entity';

@Entity({ tableName: 'designer.event_mapping' })
export class EventMappingEntity extends PostgresCMSObjectEntity<'variable'> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property({ type: MarkupType })
  path!: Markup;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'event_id'],
  })
  event!: Ref<EventEntity>;

  @ManyToOne(() => VariableEntity, {
    name: 'variable_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'variable_id'],
  })
  variable!: Ref<VariableEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
