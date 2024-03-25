import { Entity, Index, Property, Unique } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.function' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FunctionEntity extends PostgresCMSTabularEntity<'image' | 'description'> {
  @Property({ type: 'text' })
  code!: string;

  @Property({ default: null, nullable: true })
  image!: string | null;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
