import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { PersonaOverrideJSON, PersonaOverrideObject } from './persona-override.interface';

export const PersonaOverrideJSONAdapter = createSmartMultiAdapter<PersonaOverrideObject, PersonaOverrideJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);
