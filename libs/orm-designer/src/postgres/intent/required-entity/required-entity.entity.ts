import { Entity as EntityDecorator, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSCreatableEntity } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { IntentEntity } from '../intent.entity';
import { RequiredEntityJSONAdapter } from './required-entity.adapter';

@EntityDecorator({ tableName: 'designer.required_entity' })
export class RequiredEntityEntity extends PostgresCMSCreatableEntity {
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
    fieldNames: ['reprompt_id', 'environment_id'],
  })
  reprompt: Ref<ResponseEntity> | null;

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

  toJSON(): ToJSONWithForeignKeys<RequiredEntityEntity> {
    return RequiredEntityJSONAdapter.fromDB({
      ...this.wrap<RequiredEntityEntity>(),
      entity: this.entity,
      intent: this.intent,
      reprompt: this.reprompt,
      assistant: this.assistant,
    });
  }
}
