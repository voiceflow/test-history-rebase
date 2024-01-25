import { Entity, Enum, Index, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { Environment, PostgresCMSTabularEntity } from '../common';
import { SystemVariable } from './system-variable.enum';
import { VariableJSONAdapter } from './variable.adapter';
import { VariableDatatype } from './variable-datatype.enum';

@Entity({ tableName: 'designer.variable' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class VariableEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<VariableEntity>>>(data: JSON) {
    return VariableJSONAdapter.toDB<JSON>(data);
  }

  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

  @Property()
  color: string;

  @Enum({ items: () => SystemVariable, default: null, nullable: true })
  system: SystemVariable | null;

  @Property()
  isArray: boolean;

  @Enum(() => VariableDatatype)
  datatype: VariableDatatype;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  @Property({ type: 'text', default: null, nullable: true })
  defaultValue: string | null;

  constructor({
    color,
    system,
    isArray,
    datatype,
    description,
    defaultValue,
    ...data
  }: EntityCreateParams<VariableEntity>) {
    super(data);

    ({
      color: this.color,
      system: this.system,
      isArray: this.isArray,
      datatype: this.datatype,
      description: this.description,
      defaultValue: this.defaultValue,
    } = VariableEntity.fromJSON({
      color,
      system,
      isArray,
      datatype,
      description,
      defaultValue,
    }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<VariableEntity> {
    return VariableJSONAdapter.fromDB({
      ...wrap<VariableEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      assistant: this.assistant,
    });
  }
}
