import { Entity as EntityDecorator, PrimaryKey, Property } from '@mikro-orm/core';

import { Environment, PostgresCMSTabularEntity } from '../common';

@EntityDecorator({ tableName: 'designer.entity' })
export class EntityEntity extends PostgresCMSTabularEntity<'description' | 'classifier'> {
  @Environment()
  environmentID!: string;

  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;

  @Property()
  color!: string;

  @Property({ default: null, nullable: true })
  classifier!: string | null;

  @Property()
  isArray!: boolean;
}
