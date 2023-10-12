import type { Markup, TabularResource } from '@/common';

interface PromptData {
  text: Markup;
  personaID: string | null;
}

export interface Prompt extends TabularResource, PromptData {}

export interface PromptCreateData extends PromptData {}
