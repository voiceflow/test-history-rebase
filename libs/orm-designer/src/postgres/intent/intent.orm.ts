import { PostgresCMSTabularORM } from '@/postgres/common';

import { IntentEntity } from './intent.entity';
import { IntentJSONAdapter } from './intent-json.adapter';

export class IntentORM extends PostgresCMSTabularORM<IntentEntity> {
  Entity = IntentEntity;

  jsonAdapter = IntentJSONAdapter;
}
