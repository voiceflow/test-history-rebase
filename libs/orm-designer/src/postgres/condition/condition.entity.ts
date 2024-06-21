import { Entity, Enum, Index, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { ConditionAssertion, Markup } from '@voiceflow/dtos';
import { ConditionType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { CMSCompositePK, Ref } from '@/types';

import type { AssistantEntity } from '../assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '../common';
import type { Prompt } from '../prompt';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseConditionEntity<
  DefaultOrNullColumn extends string = never,
> extends PostgresCMSObjectEntity<DefaultOrNullColumn> {
  @Enum(() => ConditionType)
  type!: ConditionType;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}

@Entity({ discriminatorValue: ConditionType.EXPRESSION })
export class ExpressionConditionEntity extends BaseConditionEntity<'assertions'> {
  type!: typeof ConditionType.EXPRESSION;

  @Property()
  matchAll!: boolean;

  @Property({ type: 'jsonb', default: '[]' })
  assertions!: ConditionAssertion[];
}

@Entity({ discriminatorValue: ConditionType.PROMPT })
export class PromptConditionEntity extends BaseConditionEntity<'prompt'> {
  type!: typeof ConditionType.PROMPT;

  @Property()
  turns!: number;

  @Property({ type: 'jsonb', nullable: true, default: null })
  prompt!: Prompt | null;
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  type!: typeof ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code!: Markup;
}
