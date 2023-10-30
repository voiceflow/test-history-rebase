import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';
import { ConditionOperation } from '../condition-operation.enum';
import { ConditionAssertionJSONAdapter } from './condition-assertion.adapter';

@Entity({ tableName: 'designer.condition_assertion' })
@Unique({ properties: ['id', 'environmentID'] })
export class ConditionAssertionEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ConditionAssertionEntity>>>(data: JSON) {
    return ConditionAssertionJSONAdapter.toDB<JSON>(data);
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

  toJSON(): ToJSONWithForeignKeys<ConditionAssertionEntity> {
    return ConditionAssertionJSONAdapter.fromDB({
      ...this.wrap<ConditionAssertionEntity>(),
      assistant: this.assistant,
      condition: this.condition,
    });
  }
}
