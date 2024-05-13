import { Entity, Property } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.event' })
export class EventEntity extends PostgresCMSTabularEntity<'description'> {
  @Property()
  requestName!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
