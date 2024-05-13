import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionOperation } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';

@Entity({ tableName: 'designer.condition_assertion' })
export class ConditionAssertionEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property({ type: MarkupType })
  lhs!: Markup;

  @Property({ type: MarkupType })
  rhs!: Markup;

  @Enum(() => ConditionOperation)
  operation!: ConditionOperation;

  @ManyToOne(() => ExpressionConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'condition_id'],
  })
  condition!: Ref<ExpressionConditionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
