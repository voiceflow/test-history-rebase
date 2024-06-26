import { Entity, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { FunctionEntity } from '../function.entity';

@Entity({ tableName: 'designer.function_path' })
@Unique({ properties: ['id', 'environmentID'] })
export class FunctionPathEntity extends PostgresCMSObjectEntity {
  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name!: string;

  @Property({ default: null, nullable: true })
  label!: string | null;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    deleteRule: 'cascade',
    fieldNames: ['function_id', 'environment_id'],
  })
  function!: Ref<FunctionEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}
