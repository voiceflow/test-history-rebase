import { Entity, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { FunctionEntity } from '../function.entity';

@Entity({ tableName: 'designer.function_path' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class FunctionPathEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<FunctionPathEntity>>({
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
    } as ResolvedForeignKeys<FunctionPathEntity, Data>;
  }

  @Property()
  name: string;

  @Property({ default: null })
  label: string | null;

  @ManyToOne(() => FunctionEntity, { fieldName: 'function_id', fieldNames: ['function_id', 'environment_id'] })
  function: Ref<FunctionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<FunctionPathEntity>) {
    super();

    ({
      name: this.name,
      label: this.label,
      function: this.function,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = FunctionPathEntity.resolveForeignKeys(data));
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
