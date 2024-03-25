import type { ToJSON, ToObject } from '@/types';

import type { PersonaEntity } from './persona.entity';

export type PersonaObject = ToObject<PersonaEntity>;
export type PersonaJSON = ToJSON<PersonaObject>;
