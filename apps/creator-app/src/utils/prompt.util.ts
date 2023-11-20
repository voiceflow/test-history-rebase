import type { Prompt } from '@voiceflow/dtos';
import { isMarkupEmpty } from '@voiceflow/utils-designer';

export const isPromptEmpty = (prompt: Prompt): boolean => isMarkupEmpty(prompt.text);

export const isPromptsArrayEmpty = (prompts: Prompt[]): boolean => !prompts.length || prompts.every(isPromptEmpty);
