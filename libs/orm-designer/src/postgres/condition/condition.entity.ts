import { Entity, Enum, Index, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { CMSCompositePK, Ref } from '@/types';

import type { AssistantEntity } from '../assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '../common';
import type { PromptEntity } from '../prompt';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseConditionEntity<
  DefaultOrNullColumn extends string = never
> extends PostgresCMSObjectEntity<DefaultOrNullColumn> {
  @Enum(() => ConditionType)
  type!: ConditionType;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

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

  @Property({ type: 'jsonb', nullable: true, default: null })
  prompt!: PromptEntity | null;
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  type!: typeof ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code!: Markup;
}
