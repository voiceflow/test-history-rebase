import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { PersonaOverrideEntity } from './persona-override.entity';

export class PersonaOverrideORM extends PostgresCMSObjectORM(PersonaOverrideEntity) {}
