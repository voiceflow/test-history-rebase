import { PostgresCMSTabularORM } from '@/postgres/common';

import { PromptEntity } from './prompt.entity';
import { PromptJSONAdapter } from './prompt-json.adapter';

export class PromptORM extends PostgresCMSTabularORM<PromptEntity> {
  Entity = PromptEntity;

  jsonAdapter = PromptJSONAdapter;
}
