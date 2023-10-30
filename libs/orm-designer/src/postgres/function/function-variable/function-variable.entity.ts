import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';

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

  @Property({ default: null })
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

  toJSON(): ToJSONWithForeignKeys<FunctionVariableEntity> {
    return FunctionVariableJSONAdapter.fromDB({
      ...this.wrap<FunctionVariableEntity>(),
      function: this.function,
      assistant: this.assistant,
    });
  }
}
