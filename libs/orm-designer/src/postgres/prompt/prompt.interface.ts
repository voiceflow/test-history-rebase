import type { AIModel, Markup } from '@voiceflow/dtos';

import type { ToJSON, ToObject } from '@/types';

export interface PromptSettings {
  model: AIModel | null;
  maxLength: number | null;
  temperature: number | null;
  systemPrompt: string | null;
}
export interface PromptEntity {
  text: Markup;
  settings: PromptSettings | null;
}


export type PromptObject = ToObject<PromptEntity>;
export type PromptJSON = ToJSON<PromptObject>;
