import { Entity, Enum, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity, SoftDelete } from '../common';
import { SystemVariable } from './system-variable.enum';
import { VariableDatatype } from './variable-datatype.enum';

@Entity({ tableName: 'designer.variable' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class VariableEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<VariableEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<VariableEntity, Data>;
  }

  @Property()
  color: string;

  @Enum({ items: () => SystemVariable, default: null })
  system: SystemVariable | null;

  @Property()
  isArray: boolean;

  @Enum(() => VariableDatatype)
  datatype: VariableDatatype;

  @Property({ default: null })
  description: string | null;

  @Property({ default: null })
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
    } = VariableEntity.resolveForeignKeys({
      color,
      system,
      isArray,
      datatype,
      description,
      defaultValue,
    }));
  }
}
