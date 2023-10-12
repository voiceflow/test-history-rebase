import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';
import { ConditionOperation } from '../condition-operation.enum';

@Entity({ tableName: 'designer.condition_assertion' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class ConditionAssertionEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ConditionAssertionEntity>>({
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
        ...(conditionID !== undefined && {
          condition: ref(ExpressionConditionEntity, { id: conditionID, environmentID }),
        }),
      }),
    } as ResolvedForeignKeys<ConditionAssertionEntity, Data>;
  }

  @Property({ type: MarkupType })
  lhs: Markup;

  @Property({ type: MarkupType })
  rhs: Markup;

  @Enum(() => ConditionOperation)
  operation: ConditionOperation;

  @ManyToOne(() => ExpressionConditionEntity, { name: 'condition_id', fieldNames: ['condition_id', 'environment_id'] })
  condition: Ref<ExpressionConditionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<ConditionAssertionEntity>) {
    super();

    ({
      lhs: this.lhs,
      rhs: this.rhs,
      operation: this.operation,
      condition: this.condition,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = ConditionAssertionEntity.resolveForeignKeys(data));
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
