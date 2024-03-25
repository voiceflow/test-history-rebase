import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { PersonaOverrideEntity } from './persona-override.entity';
import { PersonaOverrideJSONAdapter } from './persona-override-json.adapter';

export class PersonaOverrideORM extends PostgresCMSObjectORM<PersonaOverrideEntity> {
  Entity = PersonaOverrideEntity;

  jsonAdapter = PersonaOverrideJSONAdapter;
}
