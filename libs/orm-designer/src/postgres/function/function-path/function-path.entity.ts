import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { FunctionEntity } from '../function.entity';

@Entity({ tableName: 'designer.function_path' })
export class FunctionPathEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name!: string;

  @Property({ default: null, nullable: true })
  label!: string | null;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'function_id'],
  })
  function!: Ref<FunctionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}
