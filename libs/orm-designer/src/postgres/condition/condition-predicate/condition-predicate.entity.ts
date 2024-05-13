import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionOperation } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { PromptConditionEntity } from '../condition.entity';

@Entity({ tableName: 'designer.condition_predicate' })
export class ConditionPredicateEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property({ type: MarkupType })
  rhs!: Markup;

  @Enum(() => ConditionOperation)
  operation!: ConditionOperation;

  @ManyToOne(() => PromptConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'condition_id'],
  })
  condition!: Ref<PromptConditionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
