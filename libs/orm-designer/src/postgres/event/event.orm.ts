import { PostgresCMSTabularORM } from '@/postgres/common';

import { EventEntity } from './event.entity';

export class EventORM extends PostgresCMSTabularORM(EventEntity) {}
