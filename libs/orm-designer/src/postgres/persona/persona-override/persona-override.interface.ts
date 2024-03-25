import type { ToJSON, ToObject } from '@/types';

import type { PersonaOverrideEntity } from './persona-override.entity';

export type PersonaOverrideObject = ToObject<PersonaOverrideEntity>;
export type PersonaOverrideJSON = ToJSON<PersonaOverrideObject>;
