import { PostgresCMSTabularORM } from '@/postgres/common';

import { IntentEntity } from './intent.entity';

export class IntentORM extends PostgresCMSTabularORM(IntentEntity) {}
