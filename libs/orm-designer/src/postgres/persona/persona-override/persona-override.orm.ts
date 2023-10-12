import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';

import { PersonaOverrideEntity } from './persona-override.entity';

export class PersonaOverrideORM extends PostgresCMSMutableORM(PersonaOverrideEntity) {}
