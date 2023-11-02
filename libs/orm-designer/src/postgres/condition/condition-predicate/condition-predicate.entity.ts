import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PromptConditionEntity } from '../condition.entity';
import { ConditionOperation } from '../condition-operation.enum';
import { ConditionPredicateJSONAdapter } from './condition-predicate.adapter';

@Entity({ tableName: 'designer.condition_predicate' })
@Unique({ properties: ['id', 'environmentID'] })
export class ConditionPredicateEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ConditionPredicateEntity>>>(data: JSON) {
    return ConditionPredicateJSONAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  rhs: Markup;

  @Enum(() => ConditionOperation)
  operation: ConditionOperation;

  @ManyToOne(() => PromptConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition: Ref<PromptConditionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<ConditionPredicateEntity>) {
    super(data);

    ({
      rhs: this.rhs,
      operation: this.operation,
      condition: this.condition,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = ConditionPredicateEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ConditionPredicateEntity> {
    return ConditionPredicateJSONAdapter.fromDB({
      ...wrap<ConditionPredicateEntity>(this).toObject(...args),
      assistant: this.assistant,
      condition: this.condition,
    });
  }
}
