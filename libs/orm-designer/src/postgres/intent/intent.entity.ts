import { ArrayType, Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { Environment, PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.intent' })
export class IntentEntity extends PostgresCMSTabularEntity<'description'> {
  @Environment()
  environmentID!: string;

  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Property()
  automaticReprompt!: boolean;

  @Property({ type: ArrayType })
  entityOrder!: string[];
}
