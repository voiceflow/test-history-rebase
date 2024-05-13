import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { VariableDatatype } from '@voiceflow/dtos';

import { Environment, PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.variable' })
export class VariableEntity extends PostgresCMSTabularEntity<'isSystem' | 'description' | 'defaultValue'> {
  @Environment()
  environmentID!: string;

  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  @Property()
  color!: string;

  @Property()
  isArray!: boolean;

  @Property({ type: 'bool', default: false })
  isSystem!: boolean;

  @Enum(() => VariableDatatype)
  datatype!: VariableDatatype;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @(Property!({ type: 'text', default: null, nullable: true }))
  defaultValue!: string | null;
}
