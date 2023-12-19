import { Entity as EntityDecorator, ManyToOne, PrimaryKeyType, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { IntentEntity } from '../intent.entity';
import { RequiredEntityJSONAdapter } from './required-entity.adapter';

@EntityDecorator({ tableName: 'designer.required_entity' })
export class RequiredEntityEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<RequiredEntityEntity>>>(data: JSON) {
    return RequiredEntityJSONAdapter.toDB<JSON>(data);
  }

  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['entity_id', 'environment_id'],
  })
  entity: Ref<EntityEntity>;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent: Ref<IntentEntity>;

  @ManyToOne(() => ResponseEntity, {
    name: 'reprompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['reprompt_id', 'environment_id'],
  })
  reprompt: Ref<ResponseEntity> | null = null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<RequiredEntityEntity>) {
    super(data);

    ({
      entity: this.entity,
      intent: this.intent,
      reprompt: this.reprompt,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = RequiredEntityEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<RequiredEntityEntity> {
    return RequiredEntityJSONAdapter.fromDB({
      ...wrap<RequiredEntityEntity>(this).toObject(...args),
      entity: this.entity,
      intent: this.intent,
      reprompt: this.reprompt ?? null,
      assistant: this.assistant,
    });
  }
}
