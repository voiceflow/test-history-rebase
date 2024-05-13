import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { FunctionVariableKind } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { FunctionEntity } from '../function.entity';

@Entity({ tableName: 'designer.function_variable' })
export class FunctionVariableEntity extends PostgresCMSObjectEntity<'description'> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name!: string;

  @Enum(() => FunctionVariableKind)
  type!: FunctionVariableKind;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'function_id'],
  })
  function!: Ref<FunctionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  [PrimaryKeyType]?: CMSCompositePK;
}
