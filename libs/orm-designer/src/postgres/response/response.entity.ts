import { Entity } from '@mikro-orm/core';

import { PostgresCMSTabularEntity } from '../common';

@Entity({ tableName: 'designer.response' })
export class ResponseEntity extends PostgresCMSTabularEntity {}
