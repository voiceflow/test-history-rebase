import { Entity as EntityDecorator, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSCompositePK, Ref } from '@/types';

import { IntentEntity } from '../intent.entity';

@EntityDecorator({ tableName: 'designer.required_entity' })
export class RequiredEntityEntity extends PostgresCMSObjectEntity<'reprompt'> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'entity_id'],
  })
  entity!: Ref<EntityEntity>;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'intent_id'],
  })
  intent!: Ref<IntentEntity>;

  @ManyToOne(() => ResponseEntity, {
    name: 'reprompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'reprompt_id'],
  })
  reprompt!: Ref<ResponseEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
