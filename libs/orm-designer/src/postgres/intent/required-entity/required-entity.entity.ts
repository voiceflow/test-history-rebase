import { Entity as EntityDecorator, Index, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSCompositePK, Ref } from '@/types';

import { IntentEntity } from '../intent.entity';

@EntityDecorator({ tableName: 'designer.required_entity' })
@Index({ properties: ['environmentID'] })
export class RequiredEntityEntity extends PostgresCMSObjectEntity<'reprompt'> {
  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['entity_id', 'environment_id'],
  })
  entity!: Ref<EntityEntity>;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent!: Ref<IntentEntity>;

  @ManyToOne(() => ResponseEntity, {
    name: 'reprompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['reprompt_id', 'environment_id'],
  })
  reprompt!: Ref<ResponseEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
