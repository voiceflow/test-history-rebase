import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PromptConditionEntity } from '../condition.entity';
import { ConditionOperation } from '../condition-operation.enum';

@Entity({ tableName: 'designer.condition_predicate' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class ConditionPredicateEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ConditionPredicateEntity>>({
    conditionID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(conditionID !== undefined && { condition: ref(PromptConditionEntity, { id: conditionID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<ConditionPredicateEntity, Data>;
  }

  @Property({ type: MarkupType })
  rhs: Markup;

  @Enum(() => ConditionOperation)
  operation: ConditionOperation;

  @ManyToOne(() => PromptConditionEntity, { name: 'condition_id', fieldNames: ['condition_id', 'environment_id'] })
  condition: Ref<PromptConditionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<ConditionPredicateEntity>) {
    super();

    ({
      rhs: this.rhs,
      operation: this.operation,
      condition: this.condition,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = ConditionPredicateEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      conditionID: this.condition.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
