import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSTabularJSONAdapter } from '@/postgres/common';

import type { PersonaJSON, PersonaObject } from './persona.interface';

export const PersonaJSONAdapter = createSmartMultiAdapter<PersonaObject, PersonaJSON>(
  PostgresCMSTabularJSONAdapter.fromDB,
  PostgresCMSTabularJSONAdapter.toDB
);
