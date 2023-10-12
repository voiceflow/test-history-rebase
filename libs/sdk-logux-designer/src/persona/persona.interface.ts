import type { TabularResource } from '@/common';

import type { PersonaModel } from './persona-model.enum';

export interface Persona extends TabularResource {
  model: PersonaModel;
  temperature: number;
  maxLength: number;
  systemPrompt: string;
}
