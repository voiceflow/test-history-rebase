import { Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { ConditionOperation } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';
import { ConditionAssertionEntityAdapter } from './condition-assertion-entity.adapter';

@Entity({ tableName: 'designer.condition_assertion' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ConditionAssertionEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ConditionAssertionEntity>>>(data: JSON) {
    return ConditionAssertionEntityAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  lhs: Markup;

  @Property({ type: MarkupType })
  rhs: Markup;

  @Enum(() => ConditionOperation)
  operation: ConditionOperation;

  @ManyToOne(() => ExpressionConditionEntity, {
    name: 'condition_id',
    onDelete: 'cascade',
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition: Ref<ExpressionConditionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<ConditionAssertionEntity>) {
    super(data);

    ({
      lhs: this.lhs,
      rhs: this.rhs,
      operation: this.operation,
      condition: this.condition,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = ConditionAssertionEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ConditionAssertionEntity> {
    return ConditionAssertionEntityAdapter.fromDB({
      ...wrap<ConditionAssertionEntity>(this).toObject(...args),
      updatedBy: this.updatedBy,
      assistant: this.assistant,
      condition: this.condition,
    });
  }
}
