import type { ObjectResource } from '@/common';

import type { PersonaModel } from '../persona-model.enum';

export interface PersonaOverride extends ObjectResource {
  name: string | null;
  model: PersonaModel | null;
  temperature: number | null;
  maxLength: number | null;
  systemPrompt: string | null;
  personaID: string;
  assistantID: string;
}
