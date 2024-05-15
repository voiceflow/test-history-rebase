import type { AIModel, Markup } from '@voiceflow/dtos';

export interface PromptSettings {
  model: AIModel | null;
  maxLength: number | null;
  temperature: number | null;
  systemPrompt: string | null;
}
export interface Prompt {
  text: Markup;
  settings: PromptSettings | null;
}
