import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import { FunctionVariableJSONAdapter } from './function-variable.adapter';
import { FunctionVariableType } from './function-variable-type.enum';

@Entity({ tableName: 'designer.function_variable' })
@Unique({ properties: ['id', 'environmentID'] })
export class FunctionVariableEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FunctionVariableEntity>>>(data: JSON) {
    return FunctionVariableJSONAdapter.toDB<JSON>(data);
  }

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

  @Property({ type: 'text', default: null })
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
    return FunctionVariableJSONAdapter.fromDB({
      ...wrap<FunctionVariableEntity>(this).toObject(...args),
      function: this.function,
      assistant: this.assistant,
    });
  }
}
