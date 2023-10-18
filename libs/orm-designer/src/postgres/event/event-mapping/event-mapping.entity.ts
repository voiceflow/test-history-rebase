import { Entity, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import { VariableEntity } from '@/postgres/variable';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { EventEntity } from '../event.entity';

@Entity({ tableName: 'designer.event_mapping' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class EventMappingEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<EventMappingEntity>>({
    eventID,
    variableID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(eventID !== undefined && { event: ref(EventEntity, { id: eventID, environmentID }) }),
        ...(variableID !== undefined && {
          variable: variableID ? ref(VariableEntity, { id: variableID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<EventMappingEntity, Data>;
  }

  @Property({ type: MarkupType })
  path: Markup;

  @ManyToOne(() => EventEntity, { name: 'event_id', fieldNames: ['event_id', 'environment_id'] })
  event: Ref<EventEntity>;

  @ManyToOne(() => VariableEntity, {
    name: 'variable_id',
    default: null,
    fieldNames: ['variable_id', 'environment_id'],
  })
  variable: Ref<VariableEntity> | null;

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
    } = EventMappingEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      eventID: this.event.id,
      variableID: this.variable?.id ?? null,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
