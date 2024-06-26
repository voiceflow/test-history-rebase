import { Entity, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { VariableEntity } from '@/postgres/variable';
import type { CMSCompositePK, Ref } from '@/types';

import { EventEntity } from '../event.entity';

@Entity({ tableName: 'designer.event_mapping' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class EventMappingEntity extends PostgresCMSObjectEntity<'variable'> {
  @Property({ type: MarkupType })
  path!: Markup;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    deleteRule: 'cascade',
    fieldNames: ['event_id', 'environment_id'],
  })
  event!: Ref<EventEntity>;

  @ManyToOne(() => VariableEntity, {
    name: 'variable_id',
    default: null,
    deleteRule: 'set default',
    nullable: true,
    fieldNames: ['variable_id', 'environment_id'],
  })
  variable!: Ref<VariableEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
