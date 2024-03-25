import { Entity, Enum, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { VariableDatatype } from '@voiceflow/dtos';

import { Environment, PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.variable' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class VariableEntity extends PostgresCMSTabularEntity<'isSystem' | 'description' | 'defaultValue'> {
  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

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
