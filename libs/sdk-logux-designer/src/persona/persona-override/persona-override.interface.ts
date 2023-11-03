import type { ObjectResource } from '@/common';

import type { PersonaModel } from '../persona-model.enum';

export interface PersonaOverride extends ObjectResource {
  name: string | null;
  model: PersonaModel | null;
  maxLength: number | null;
  personaID: string;
  temperature: number | null;
  assistantID: string;
  systemPrompt: string | null;
  environmentID: string;
}
