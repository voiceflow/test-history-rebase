import { Entity, Index, Unique } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.response' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class ResponseEntity extends PostgresCMSTabularEntity {}
