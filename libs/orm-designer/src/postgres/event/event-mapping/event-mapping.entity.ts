import { Entity, Index, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { VariableEntity } from '@/postgres/variable';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { EventEntity } from '../event.entity';
import { EventMappingJSONAdapter } from './event-mapping.adapter';

@Entity({ tableName: 'designer.event_mapping' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class EventMappingEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EventMappingEntity>>>(data: JSON) {
    return EventMappingJSONAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  path: Markup;

  @ManyToOne(() => EventEntity, {
    name: 'event_id',
    onDelete: 'cascade',
    fieldNames: ['event_id', 'environment_id'],
  })
  event: Ref<EventEntity>;

  @ManyToOne(() => VariableEntity, {
    name: 'variable_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['variable_id', 'environment_id'],
  })
  variable: Ref<VariableEntity> | null = null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<EventMappingEntity>) {
    super(data);

    ({
      path: this.path,
      event: this.event,
      variable: this.variable,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = EventMappingEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EventMappingEntity> {
    return EventMappingJSONAdapter.fromDB({
      ...wrap<EventMappingEntity>(this).toObject(...args),
      event: this.event,
      variable: this.variable ?? null,
      assistant: this.assistant,
    });
  }
}
