import { Entity, Property } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.function' })
export class FunctionEntity extends PostgresCMSTabularEntity<'image' | 'description'> {
  @Property({ type: 'text' })
  code!: string;

  @Property({ default: null, nullable: true })
  image!: string | null;

  @Property({ type: 'text', default: null, nullable: true })
  description!: string | null;
}
