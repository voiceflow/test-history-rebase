import { Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionOperation } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { PromptConditionEntity } from '../condition.entity';

@Entity({ tableName: 'designer.condition_predicate' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ConditionPredicateEntity extends PostgresCMSObjectEntity {
  @Property({ type: MarkupType })
  rhs!: Markup;

  @Enum(() => ConditionOperation)
  operation!: ConditionOperation;

  @ManyToOne(() => PromptConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition!: Ref<PromptConditionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyType]?: CMSCompositePK;
}
