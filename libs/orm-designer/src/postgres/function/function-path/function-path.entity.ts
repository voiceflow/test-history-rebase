import { Entity, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, CreatedAt, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import { FunctionPatchJSONAdapter } from './function-path.adapter';

@Entity({ tableName: 'designer.function_path' })
@Unique({ properties: ['id', 'environmentID'] })
export class FunctionPathEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FunctionPathEntity>>>(data: JSON) {
    return FunctionPatchJSONAdapter.toDB<JSON>(data);
  }

  @CreatedAt({ columnType: 'timestamptz' })
  createdAt!: Date;

  @Property()
  name: string;

  @Property({ default: null, nullable: true })
  label: string | null;

  @ManyToOne(() => FunctionEntity, {
    name: 'function_id',
    onDelete: 'cascade',
    fieldNames: ['function_id', 'environment_id'],
  })
  function: Ref<FunctionEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<FunctionPathEntity>) {
    super(data);

    ({
      name: this.name,
      label: this.label,
      function: this.function,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = FunctionPathEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<FunctionPathEntity> {
    return FunctionPatchJSONAdapter.fromDB({
      ...wrap<FunctionPathEntity>(this).toObject(...args),
      function: this.function,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}
