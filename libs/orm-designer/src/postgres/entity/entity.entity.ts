import { Entity as EntityDecorator, Index, PrimaryKey, Property } from '@mikro-orm/core';

import { Environment, PostgresCMSTabularEntity } from '../common';

@EntityDecorator({ tableName: 'designer.entity' })
@Index({ properties: ['environmentID'] })
export class EntityEntity extends PostgresCMSTabularEntity<'description' | 'classifier'> {
  // legacy entityIDs could be longer than 24 chars
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Property()
  color!: string;

  @Property({ default: null, nullable: true })
  classifier!: string | null;

  @Property()
  isArray!: boolean;
}
