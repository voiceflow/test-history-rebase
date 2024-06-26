import { Entity, Enum, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { FunctionVariableKind } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { FunctionEntity } from '../function.entity';

@Entity({ tableName: 'designer.function_variable' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FunctionVariableEntity extends PostgresCMSObjectEntity<'description'> {
  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name!: string;

  @Enum(() => FunctionVariableKind)
  type!: FunctionVariableKind;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    deleteRule: 'cascade',
    fieldNames: ['function_id', 'environment_id'],
  })
  function!: Ref<FunctionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
