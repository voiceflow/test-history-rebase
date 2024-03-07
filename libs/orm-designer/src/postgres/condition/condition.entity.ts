import {
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import type { AssistantEntity } from '../assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '../common';
import { PromptEntity } from '../prompt';
import type { ConditionAssertionEntity } from './condition-assertion/condition-assertion.entity';
import {
  BaseConditionEntityAdapter,
  ExpressionConditionEntityAdapter,
  PromptConditionEntityAdapter,
  ScriptConditionEntityAdapter,
} from './condition-entity.adapter';
import type { ConditionPredicateEntity } from './condition-predicate/condition-predicate.entity';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseConditionEntity extends PostgresCMSObjectEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseConditionEntity>>) {
    return BaseConditionEntityAdapter.toDB(data);
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
    return BaseConditionEntityAdapter.fromDB(this);
  }
}

@Entity({ discriminatorValue: ConditionType.EXPRESSION })
export class ExpressionConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ExpressionConditionEntity>>>(data: JSON) {
    return ExpressionConditionEntityAdapter.toDB<JSON>(data);
  }

  type: typeof ConditionType.EXPRESSION = ConditionType.EXPRESSION;

  @Property()
  matchAll: boolean;

  @OneToMany('ConditionAssertionEntity', (value: ConditionAssertionEntity) => value.condition)
  assertions = new Collection<ConditionAssertionEntity>(this);

  constructor({ matchAll, ...data }: EntityCreateParams<ExpressionConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.EXPRESSION });

    ({ matchAll: this.matchAll } = ExpressionConditionEntity.fromJSON({ matchAll }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ExpressionConditionEntity> {
    return ExpressionConditionEntityAdapter.fromDB({
      ...wrap<ExpressionConditionEntity>(this).toObject(...args),
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}

@Entity({ discriminatorValue: ConditionType.PROMPT })
export class PromptConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PromptConditionEntity>>>(data: JSON) {
    return PromptConditionEntityAdapter.toDB<JSON>(data);
  }

  type: typeof ConditionType.PROMPT = ConditionType.PROMPT;

  @Property()
  turns: number;

  @ManyToOne(() => PromptEntity, {
    name: 'prompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
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
    return PromptConditionEntityAdapter.fromDB({
      ...wrap<PromptConditionEntity>(this).toObject(...args),
      prompt: this.prompt ?? null,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ScriptConditionEntity>>>(data: JSON) {
    return ScriptConditionEntityAdapter.toDB<JSON>(data);
  }

  type: typeof ConditionType.SCRIPT = ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code: Markup;

  constructor({ code, ...data }: EntityCreateParams<ScriptConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.SCRIPT });

    ({ code: this.code } = ScriptConditionEntity.fromJSON({ code }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ScriptConditionEntity> {
    return ScriptConditionEntityAdapter.fromDB({
      ...wrap<ScriptConditionEntity>(this).toObject(...args),
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}
