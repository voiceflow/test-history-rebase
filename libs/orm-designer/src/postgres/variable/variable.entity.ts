import { Entity, Enum, Index, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { Environment, PostgresCMSTabularEntity } from '../common';
import { VariableDatatype } from './variable-datatype.enum';
import { VariableEntityAdapter } from './variable-entity.adapter';

@Entity({ tableName: 'designer.variable' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class VariableEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<VariableEntity>>>(data: JSON) {
    return VariableEntityAdapter.toDB<JSON>(data);
  }

  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

  @Property()
  color: string;

  @Property()
  isArray: boolean;

  @Property({ default: false })
  isSystem = false;

  @Enum(() => VariableDatatype)
  datatype: VariableDatatype;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  @Property({ type: 'text', default: null, nullable: true })
  defaultValue: string | null;

  constructor({
    color,
    isArray,
    isSystem,
    datatype,
    description,
    defaultValue,
    ...data
  }: EntityCreateParams<VariableEntity>) {
    super(data);

    ({
      color: this.color,
      isArray: this.isArray,
      isSystem: this.isSystem,
      datatype: this.datatype,
      description: this.description,
      defaultValue: this.defaultValue,
    } = VariableEntity.fromJSON({
      color,
      isArray,
      isSystem,
      datatype,
      description,
      defaultValue,
    }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<VariableEntity> {
    return VariableEntityAdapter.fromDB({
      ...wrap<VariableEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      assistant: this.assistant,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
    });
  }
}
