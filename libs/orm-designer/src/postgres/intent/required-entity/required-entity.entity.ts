import { Entity as EntityDecorator, ManyToOne, PrimaryKeyType, ref } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSCreatableEntity, SoftDelete } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { IntentEntity } from '../intent.entity';

@EntityDecorator({ tableName: 'designer.required_entity' })
@SoftDelete()
export class RequiredEntityEntity extends PostgresCMSCreatableEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<RequiredEntityEntity>>({
    entityID,
    intentID,
    repromptID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(entityID !== undefined && { entity: ref(EntityEntity, { id: entityID, environmentID }) }),
        ...(intentID !== undefined && { intent: ref(IntentEntity, { id: intentID, environmentID }) }),
        ...(repromptID !== undefined && {
          reprompt: repromptID ? ref(ResponseEntity, { id: repromptID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<RequiredEntityEntity, Data>;
  }

  @ManyToOne(() => EntityEntity, { name: 'entity_id', fieldNames: ['entity_id', 'environment_id'] })
  entity: Ref<EntityEntity>;

  @ManyToOne(() => IntentEntity, { name: 'intent_id', fieldNames: ['intent_id', 'environment_id'] })
  intent: Ref<IntentEntity>;

  @ManyToOne(() => ResponseEntity, {
    name: 'reprompt_id',
    default: null,
    fieldNames: ['reprompt_id', 'environment_id'],
  })
  reprompt: Ref<ResponseEntity> | null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<RequiredEntityEntity>) {
    super();

    ({
      entity: this.entity,
      intent: this.intent,
      reprompt: this.reprompt,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = RequiredEntityEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      intentID: this.intent.id,
      entityID: this.entity.id,
      repromptID: this.reprompt?.id ?? null,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
