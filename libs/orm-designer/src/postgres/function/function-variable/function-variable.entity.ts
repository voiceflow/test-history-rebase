import { Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import { FunctionVariableEntityAdapter } from './function-variable-entity.adapter';
import { FunctionVariableType } from './function-variable-type.enum';

@Entity({ tableName: 'designer.function_variable' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FunctionVariableEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FunctionVariableEntity>>>(data: JSON) {
    return FunctionVariableEntityAdapter.toDB<JSON>(data);
  }

  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name: string;

  @Enum(() => FunctionVariableType)
  type: FunctionVariableType;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    onDelete: 'cascade',
    fieldNames: ['function_id', 'environment_id'],
  })
  function: Ref<FunctionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<FunctionVariableEntity>) {
    super(data);

    ({
      name: this.name,
      type: this.type,
      function: this.function,
      assistant: this.assistant,
      description: this.description,
      environmentID: this.environmentID,
    } = FunctionVariableEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<FunctionVariableEntity> {
    return FunctionVariableEntityAdapter.fromDB({
      ...wrap<FunctionVariableEntity>(this).toObject(...args),
      function: this.function,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}
