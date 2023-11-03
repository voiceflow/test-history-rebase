import type { TabularResource } from '@/common';

import type { PersonaModel } from './persona-model.enum';

export interface Persona extends TabularResource {
  model: PersonaModel;
  maxLength: number;
  temperature: number;
  systemPrompt: string;
}
