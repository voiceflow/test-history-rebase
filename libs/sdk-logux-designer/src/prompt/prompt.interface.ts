import type { Markup, TabularResource } from '@/common';

export interface Prompt extends TabularResource {
  text: Markup;
  personaID: string | null;
}

export type PromptCreateData = Pick<Prompt, 'text' | 'personaID'>;
