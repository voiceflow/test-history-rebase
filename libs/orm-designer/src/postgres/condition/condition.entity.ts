import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { CMSCompositePK, Ref } from '@/types';

import type { AssistantEntity } from '../assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '../common';
import { PromptEntity } from '../prompt';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
export class BaseConditionEntity<DefaultOrNullColumn extends string = never> extends PostgresCMSObjectEntity<DefaultOrNullColumn> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Enum(() => ConditionType)
  type!: ConditionType;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}

@Entity({ discriminatorValue: ConditionType.EXPRESSION })
export class ExpressionConditionEntity extends BaseConditionEntity {
  type!: typeof ConditionType.EXPRESSION;

  @Property()
  matchAll!: boolean;
}

@Entity({ discriminatorValue: ConditionType.PROMPT })
export class PromptConditionEntity extends BaseConditionEntity<'prompt'> {
  type!: typeof ConditionType.PROMPT;

  @Property()
  turns!: number;

  @ManyToOne(() => PromptEntity, {
    name: 'prompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'prompt_id'],
  })
  prompt!: Ref<PromptEntity> | null;
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  type!: typeof ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code!: Markup;
}
