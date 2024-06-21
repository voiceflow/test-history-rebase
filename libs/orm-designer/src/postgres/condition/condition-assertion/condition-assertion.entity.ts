import { Entity, Enum, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionOperation } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';

@Entity({ tableName: 'designer.condition_assertion' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ConditionAssertionEntity extends PostgresCMSObjectEntity {
  @Property({ type: MarkupType })
  lhs!: Markup;

  @Property({ type: MarkupType })
  rhs!: Markup;

  @Enum(() => ConditionOperation)
  operation!: ConditionOperation;

  @ManyToOne(() => ExpressionConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition!: Ref<ExpressionConditionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
