import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { AssistantEntity } from '../assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '../common';
import { PromptEntity } from '../prompt';
import { ConditionAssertionEntity } from './condition-assertion/condition-assertion.entity';
import { ConditionPredicateEntity } from './condition-predicate/condition-predicate.entity';
import { ConditionType } from './condition-type.enum';

@Entity({
  abstract: true,
  tableName: 'designer.condition',
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class BaseConditionEntity extends PostgresCMSObjectEntity {
  static resolveBaseForeignKeys<Entity extends BaseConditionEntity, Data extends ResolveForeignKeysParams<Entity>>({
    assistantID,
    environmentID,
    ...data
  }: Data & { assistantID?: string; environmentID?: string }) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && { environmentID }),
    } as ResolvedForeignKeys<Entity, Data>;
  }

  static resolveForeignKeys(data: ResolveForeignKeysParams<BaseConditionEntity>) {
    return this.resolveBaseForeignKeys(data);
  }

  @Enum(() => ConditionType)
  type: ConditionType;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseConditionEntity>) {
    super();

    ({
      type: this.type,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = BaseConditionEntity.resolveBaseForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

@Entity({ discriminatorValue: ConditionType.EXPRESSION })
export class ExpressionConditionEntity extends BaseConditionEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ExpressionConditionEntity>>(data: Data) {
    return { ...BaseConditionEntity.resolveBaseForeignKeys(data) } as ResolvedForeignKeys<
      ExpressionConditionEntity,
      Data
    >;
  }

  type: ConditionType.EXPRESSION = ConditionType.EXPRESSION;

  @Property()
  matchAll: boolean;

  @OneToMany(() => ConditionAssertionEntity, (value) => value.condition)
  assertions = new Collection<ConditionAssertionEntity>(this);

  constructor({ matchAll, ...data }: EntityCreateParams<ExpressionConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.EXPRESSION });

    ({ matchAll: this.matchAll } = ExpressionConditionEntity.resolveForeignKeys({ matchAll }));
  }
}

@Entity({ discriminatorValue: ConditionType.PROMPT })
export class PromptConditionEntity extends BaseConditionEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<PromptConditionEntity>>({ promptID, ...data }: Data) {
    return {
      ...BaseConditionEntity.resolveBaseForeignKeys(data),
      ...(promptID !== undefined &&
        data.environmentID !== undefined && {
          prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
        }),
    } as ResolvedForeignKeys<PromptConditionEntity, Data>;
  }

  type: ConditionType.PROMPT = ConditionType.PROMPT;

  @Property()
  turns: number;

  @ManyToOne(() => PromptEntity, { name: 'prompt_id', default: null, fieldNames: ['prompt_id', 'environment_id'] })
  prompt: Ref<PromptEntity> | null;

  @OneToMany(() => ConditionPredicateEntity, (value) => value.condition)
  predicates = new Collection<ConditionPredicateEntity>(this);

  constructor({ turns, promptID, ...data }: EntityCreateParams<PromptConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.PROMPT });

    ({ turns: this.turns, prompt: this.prompt } = PromptConditionEntity.resolveForeignKeys({ turns, promptID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      promptID: this.prompt?.id ?? null,
    };
  }
}

@Entity({ discriminatorValue: ConditionType.SCRIPT })
export class ScriptConditionEntity extends BaseConditionEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ScriptConditionEntity>>(data: Data) {
    return { ...BaseConditionEntity.resolveBaseForeignKeys(data) } as ResolvedForeignKeys<ScriptConditionEntity, Data>;
  }

  type: ConditionType.SCRIPT = ConditionType.SCRIPT;

  @Property({ type: MarkupType })
  code: Markup;

  constructor({ code, ...data }: EntityCreateParams<ScriptConditionEntity, 'type'>) {
    super({ ...data, type: ConditionType.SCRIPT });

    ({ code: this.code } = ScriptConditionEntity.resolveForeignKeys({ code }));
  }
}
