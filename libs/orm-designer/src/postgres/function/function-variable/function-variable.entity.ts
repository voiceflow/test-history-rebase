import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { FunctionEntity } from '../function.entity';
import { FunctionVariableType } from './function-variable-type.enum';

@Entity({ tableName: 'designer.function_variable' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class FunctionVariableEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<FunctionVariableEntity>>({
    functionID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(functionID !== undefined && {
          function: functionID ? ref(FunctionEntity, { id: functionID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<FunctionVariableEntity, Data>;
  }

  @Property()
  name: string;

  @Enum(() => FunctionVariableType)
  type: FunctionVariableType;

  @ManyToOne(() => FunctionEntity, { fieldName: 'function_id', fieldNames: ['function_id', 'environment_id'] })
  function: Ref<FunctionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Property({ default: null })
  description: string | null;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<FunctionVariableEntity>) {
    super();

    ({
      name: this.name,
      type: this.type,
      function: this.function,
      assistant: this.assistant,
      description: this.description,
      environmentID: this.environmentID,
    } = FunctionVariableEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      functionID: this.function.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}
