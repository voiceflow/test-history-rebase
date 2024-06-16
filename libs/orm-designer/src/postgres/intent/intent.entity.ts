import { ArrayType, Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IntentAutomaticRepromptSettings } from '@voiceflow/dtos';

import { Environment, PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.intent' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class IntentEntity extends PostgresCMSTabularEntity<'description' | 'automaticRepromptSettings'> {
  // legacy built-in intents uses type as id, so increase length to 64
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Property()
  automaticReprompt!: boolean;

  @Property({ type: ArrayType })
  entityOrder!: string[];

  @Property({ type: 'jsonb', nullable: true, default: null })
  automaticRepromptSettings!: IntentAutomaticRepromptSettings | null;
}
