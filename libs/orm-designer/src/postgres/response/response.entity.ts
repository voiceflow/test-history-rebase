import { Entity, Enum, Index, Property, Unique } from '@mikro-orm/core';
import { ResponseType } from '@voiceflow/dtos';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.response' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseEntity extends PostgresCMSTabularEntity {
  @Enum({
    items: () => ResponseType,
    nullable: true,
    default: ResponseType.MESSAGE,
    hidden: true,
  })
  type?: ResponseType | null;

  @Property({ type: 'boolean', nullable: true, default: false, hidden: true })
  draft?: boolean | null;
}
