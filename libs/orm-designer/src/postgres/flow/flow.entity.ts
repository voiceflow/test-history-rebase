import { Entity, Property } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.flow' })
export class FlowEntity extends PostgresCMSTabularEntity<'description'> {
  @Property({ type: 'varchar', length: 24 })
  diagramID!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
