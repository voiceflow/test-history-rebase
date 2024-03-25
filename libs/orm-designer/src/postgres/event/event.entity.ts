import { Entity, Index, Property, Unique } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.event' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class EventEntity extends PostgresCMSTabularEntity<'description'> {
  @Property()
  requestName!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
