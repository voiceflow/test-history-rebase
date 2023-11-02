import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import type { AssistantEntity } from '../assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '../common';
import { PromptEntity } from '../prompt';
import {
  BaseConditionJSONAdapter,
  ExpressionConditionJSONAdapter,
  PromptConditionJSONAdapter,
  ScriptConditionJSONAdapter,
} from './condition.adapter';
import type { ConditionAssertionEntity } from './condition-assertion/condition-assertion.entity';
import type { ConditionPredicateEntity } from './condition-predicate/condition-predicate.entity';
import { ConditionType } from './condition-type.enum';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseConditionEntity extends PostgresCMSObjectEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseConditionEntity>>) {
    return BaseConditionJSONAdapter.toDB(data);
  }

  @Enum(() => ConditionType)
  type: ConditionType;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseConditionEntity>) {
    super(data);

    ({
      type: this.type,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = BaseConditionEntity.fromJSON(data));
  }

  toJSON(): ToJSONWithForeignKeys<BaseConditionEntity> {
    return BaseConditionJSONAdapter.fromDB(this);
  }
}

@Entity({ discriminatorValue: ConditionType.EXPRESSION })
export class ExpressionConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ExpressionConditionEntity>>>(data: JSON) {
    return ExpressionConditionJSONAdapter.toDB<JSON>(data);
  }

  type: ConditionType.EXPRESSION = ConditionType.EXPRESSION;

  @Property()
  matchAll: boolean;

  @OneToMany('ConditionAssertionEntity', (value: ConditionAssertionEntity) => value.condition)
  assertions = new Collection<ConditionAssertionEntity>(this);

  constructor({ matchAll, ...data }: EntityCreateParams<ExpressionConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.EXPRESSION });

    ({ matchAll: this.matchAll } = ExpressionConditionEntity.fromJSON({ matchAll }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ExpressionConditionEntity> {
    return ExpressionConditionJSONAdapter.fromDB({
      ...wrap<ExpressionConditionEntity>(this).toObject(...args),
      assistant: this.assistant,
    });
  }
}

@Entity({ discriminatorValue: ConditionType.PROMPT })
export class PromptConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PromptConditionEntity>>>(data: JSON) {
    return PromptConditionJSONAdapter.toDB<JSON>(data);
  }

  type: ConditionType.PROMPT = ConditionType.PROMPT;

  @Property()
  turns: number;

  @ManyToOne(() => PromptEntity, {
    name: 'prompt_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['prompt_id', 'environment_id'],
  })
  prompt: Ref<PromptEntity> | null = null;

  @OneToMany('ConditionPredicateEntity', (value: ConditionPredicateEntity) => value.condition)
  predicates = new Collection<ConditionPredicateEntity>(this);

  constructor({ turns, promptID, ...data }: EntityCreateParams<PromptConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.PROMPT });

    ({ turns: this.turns, prompt: this.prompt } = PromptConditionEntity.fromJSON({ turns, promptID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<PromptConditionEntity> {
    return PromptConditionJSONAdapter.fromDB({
      ...wrap<PromptConditionEntity>(this).toObject(...args),
      prompt: this.prompt ?? null,
      assistant: this.assistant,
    });
  }
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ScriptConditionEntity>>>(data: JSON) {
    return ScriptConditionJSONAdapter.toDB<JSON>(data);
  }

  type: ConditionType.SCRIPT = ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code: Markup;

  constructor({ code, ...data }: EntityCreateParams<ScriptConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.SCRIPT });

    ({ code: this.code } = ScriptConditionEntity.fromJSON({ code }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ScriptConditionEntity> {
    return ScriptConditionJSONAdapter.fromDB({
      ...wrap<ScriptConditionEntity>(this).toObject(...args),
      assistant: this.assistant,
    });
  }
}
